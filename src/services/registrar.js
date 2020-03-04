const { getDatabase } = require('../helpers/get_database');
const { generateSecureToken } = require('../helpers/secure_token');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

class RegistrarService {
    static async SendRegistrationToken(email, roleId) {
        const database = await getDatabase();
        try {
            const token = generateSecureToken();
            const registrationToken = database.RegistrationToken
                .build({ email, assignedRoleId: roleId, token });
            await registrationToken.save();
            return registrationToken;
        } catch (err) {
            logger.error('Error while saving registration tokens: ', err);
            throw new Errors.BadRequest('Invalid email or token information');
        }
    }
}

module.exports = RegistrarService;
