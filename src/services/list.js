const { getDatabase } = require('../helpers/get_database');
const { permissions } = require('../models/schema/permissions');


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
            include: [{
                model: database.RolePermission,
                attributes: [['permissionId', 'name']],
            }],
        });
        return { roles };
    }

    /**
     * Lists the tokens available.
     * Only 20 most recent entries are given.
     * @returns {Promise<{tokens: any[]}>} List of tokens in the database
     */
    static async ListTokens() {
        const database = await getDatabase();
        const tokens = await database.RegistrationToken.findAll({
            attributes: ['email', 'valid', 'updatedAt'],
            include: [{
                model: database.Role,
                attributes: ['id', 'name'],
            }],
            order: [['updatedAt', 'DESC']],
            limit: 20,
        });
        return { tokens };
    }

    /**
     * Lists the labs available.
     * @returns {Promise<{labs: Object[]}>} List of labs in the database
     */
    static async ListLabs() {
        const database = await getDatabase();
        const labs = await database.Lab.findAll();
        return { labs };
    }


    /**
     * Lists the permissions available.
     * @returns {Promise<{permissions: Object[]}>} List of permissions available
     */
    static async ListRolePermissions() {
        return { permissions };
    }

    /**
     * Lists the itemsets available.
     * @returns {Promise<{itemsets: Object[]}>} List of itemsets available
     */
    static async ListItemsets() {
        const database = await getDatabase();
        const Itemsets = await database.ItemSet.findAll({
            attributes: ['id', 'title', 'image'],
            include: [{
                model: database.Attribute,
                attributes: ['key', 'defaultValue', 'editable'],
            }],
        });
        return { Itemsets };
    }

    static async ListUsers() {
        const database = await getDatabase();
        const users = await database.User.findAll({
            attributes: ['firstName', 'lastName', 'email', 'roleId'],
            include: [{
                model: database.Role,
                attributes: ['name'],
            }],
        });
        return { users };
    }
}

module.exports = ListService;
