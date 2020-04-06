const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

class UserService {
    /**
     * Deletes user with given ID.
     * @param {string} id User id to delete
     */
    static async DeleteUser(id) {
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

    /**
     * Updates user with the given ID.
     * @param {string} id ID of the user to update
     * @param {string} firstName New first name
     * @param {string} lastName New last name
     * @returns {Promise<Object>} Created user object
     */
    static async UpdateUser(id, firstName, lastName) {
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
