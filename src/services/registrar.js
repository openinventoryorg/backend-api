const { getDatabase } = require('../helpers/get_database');
const { generateSecureToken } = require('../helpers/secure_token');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

class RegistrarService {
    static async SendRegistrationToken(email, roleId) {
        const database = await getDatabase();
        const token = generateSecureToken(96);

        // No need to check if user is already registered
        // since, if the user is registered, the token
        // will be invalid (not deleted).
        // So existence of token shows either,
        // invitation link is already sent or
        // account already created

        const existingToken = await database.RegistrationToken
            .findOne({ where: { email } });
        if (existingToken) {
            throw new Errors
                .BadRequest(`User ${email} is already sent an invitation link or account already created`);
        }

        // Build and save token
        const registrationToken = database.RegistrationToken
            .build({ email, assignedRoleId: roleId, token });
        try {
            await registrationToken.save();
            // TODO: Send token via email
            logger.info(`Token generated for ${email} on role ${roleId} - ${token}`);
        } catch (err) {
            logger.error('Error while saving registration token: ', err);
            throw new Errors.BadRequest('Invalid data. Token saving failed.');
        }

        return registrationToken;
    }

    static async DeleteRegistrationToken(email) {
        const database = await getDatabase();

        // To delete registration token, it has to be
        // in created and valid state. (If deleted can't delete,
        // if created and invalid then account is already created)

        const existingActiveToken = await database.RegistrationToken
            .findOne({ where: { email, valid: true } });
        if (!existingActiveToken) {
            throw new Errors
                .BadRequest(`User ${email} is not sent an invitation link or ther user has created a account.`);
        }

        try {
            await existingActiveToken.destroy();
        } catch (err) {
            logger.error('Error while deleting registration token: ', err);
            throw new Errors.BadRequest('Invalid data. Token deletion failed.');
        }
    }
}


module.exports = RegistrarService;
