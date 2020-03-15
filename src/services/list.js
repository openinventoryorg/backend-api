const { getDatabase } = require('../helpers/get_database');

/**
 * Service which is associated with listing items.
 * @abstract
 * @category Services
 */
class ListService {
    /**
     * Lists the roles available.
     * @returns {Promise<{roles: any[]}>} List of roles in the database
     */
    static async ListRoles() {
        const database = await getDatabase();
        const roles = await database.Role.findAll({
            attributes: ['id', 'name'],
        });
        return { roles };
    }
}

module.exports = ListService;
