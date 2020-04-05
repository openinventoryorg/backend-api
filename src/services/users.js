const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

class UserService {
    static async DeleteUsers(id) {
        const database = await getDatabase();

        const existingUser = await database.User.findOne({ where: { id } });
        if (!existingUser) {
            throw new Errors.BadRequest(`User ${id} does not exist.`);
        }
        try {
            await existingUser.destroy();
        } catch (error) {
            logger.error('Error while deleting User: ', error);
            throw new Errors.BadRequest('Invalid data. User deletion failed.');
        }
    }

    static async UpdateUsers({
        id, firstName, lastName,
    }) {
        const database = await getDatabase();

        const existingUser = await database.User.findOne({ where: { id } });
        if (!existingUser) {
            throw new Errors.BadRequest(`User ${id} does not exist`);
        }
        try {
            const User = await existingUser.update({
                id, firstName, lastName,
            });
            return User;
        } catch (error) {
            logger.error('Error while updating User: ', error);
            throw new Errors.BadRequest('Invalid data. User updating failed.');
        }
    }
}


module.exports = UserService;
