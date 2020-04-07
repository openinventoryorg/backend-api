const { getDatabase } = require('../helpers/get_database');
const { permissions } = require('../models/schema/permissions');
const Errors = require('../helpers/errors');

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
            order: ['createdAt'],
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
        const labs = await database.Lab.findAll({ order: ['createdAt'] });
        return { labs };
    }

    /**
     * Lists the items available in the specified lab.
     * @param {string} labId ID of lab
     * @returns {Promise<{labs: Object[]}>} List of labs in the database
     */
    static async ListLabItems(labId) {
        const database = await getDatabase();
        const labItems = await database.Item.findAll({
            where: { labId },
            order: ['createdAt'],
            include: [
                {
                    model: database.ItemSet,
                    attributes: ['id', 'title', 'image'],
                },
            ],
        });
        return { labItems };
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
            order: ['createdAt'],
            attributes: ['id', 'title', 'image'],
            include: [{
                model: database.Attribute,
                attributes: ['key', 'defaultValue', 'editable'],
            }],
        });
        return { Itemsets };
    }

    /**
     * Lists the items available.
     * @returns {Promise<{items: Object[]}>} List of items available
     */
    static async ListItems() {
        const database = await getDatabase();
        const items = await database.Item.findAll({
            order: ['createdAt'],
            attributes: ['id', 'serialNumber'],
            include: [
                {
                    model: database.ItemSet,
                    attributes: ['id', 'title', 'image'],
                },
                {
                    model: database.Lab,
                    attributes: ['id', 'title', 'subtitle', 'image'],
                },
            ],
        });
        return { items };
    }

    /**
     * Lists the users available.
     * @returns {Promise<{users: Object[]}>} List of users available
     */
    static async ListUsers() {
        const database = await getDatabase();
        const users = await database.User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'roleId'],
            include: [{
                model: database.Role,
                attributes: ['name'],
            }],
        });
        return { users };
    }

    /**
     * Lists the users assigned to a lab with a given id.
     * @returns {Promise<{users: Object[]}>} List of users assigned to the lab
     */
    static async ListUsersAssignedToLab({ id }) {
        const database = await getDatabase();
        const users = await database.Lab.findOne({
            where: { id },
            order: ['createdAt'],
            attributes: ['id'],
            include: [{
                model: database.User,
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }],
        });

        if (!users) {
            throw new Errors.BadRequest(`Lab ${id} does not exist.`);
        }
        return { users };
    }
}

module.exports = ListService;
