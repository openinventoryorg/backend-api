const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
// const logger = require('../loaders/logger');

class RegistrationService {
    static async VerifyRegistrationToken(token) {
        const database = await getDatabase();

        // Token Should be Created, Valid in order
        // To be verified

        const existingToken = await database.RegistrationToken
            .findOne({
                where: { token, valid: true },
                // attributes: ['email', 'assignedRoleId'],
                include: [{ model: database.Role }],
            });
        if (!existingToken) {
            throw new Errors.BadRequest('Invalid token');
        }

        return existingToken;
    }
}


module.exports = RegistrationService;
