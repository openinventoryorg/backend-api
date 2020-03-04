const { getDatabase } = require('../helpers/get_database');
const { generateSecureToken } = require('../helpers/secure_token');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

class RegistrarService {
    static async SendRegistrationToken(email, roleId) {
        const database = await getDatabase();
        const token = generateSecureToken();

        // Check if user is already registered
        const existingUser = await database.User.findOne({ where: { email } });
        if (existingUser) throw new Errors.BadRequest(`User ${email} is already registered in the system`);

        // Check if user is sent an invitation link already
        const existingActiveToken = await database.RegistrationToken
            .findOne({ where: { email, valid: true } });
        if (existingActiveToken) throw new Errors.BadRequest(`User ${email} is already sent an invitation link`);

        // Build and save token
        const registrationToken = database.RegistrationToken
            .build({ email, assignedRoleId: roleId, token });
        try {
            await registrationToken.save();
        } catch (err) {
            logger.error('Error while saving registration tokens: ', err);
            throw Errors.BadRequest('Invalid data. Token saving failed.');
        }

        return registrationToken;
    }
}

module.exports = RegistrarService;
