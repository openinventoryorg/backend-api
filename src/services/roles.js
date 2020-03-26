const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CRUD of roles
 * @abstract
 * @category Services
 */
class RolesService {
    /**
     * Creates roles with given data.
     * Id will be automatically generated.
     * @param {Object} role Role object to create
     * @param {string} role.name name of role
     * @param {array} permissions Permissions for the role
     * @returns {Promise<Object>} Created role object
     */
    static async CreateRole({ name, permissions }) {
        // get database connection
        const database = await getDatabase();

        // check for same name roles - name should be unique
        const sameNameRole = await database.Role.findOne({ where: { name } });
        if (sameNameRole) {
            throw new Errors.BadRequest(`A role with the name ${name} is already created. Role name must be unique`);
        }
        const role = database.Role.build({ name });
        const roleId = role.id;
        const permissionList = permissions.map((permissionId) => ({ roleId, permissionId }));

        // the operations of saving `role`, `rolePermission` are done through an sql transaction
        // An async callback is passed into the transaction
        // A transaction is automatically started and transaction object t is obtained
        // If callback success commit, else rollback
        try {
            await database.sequelize.transaction(async (t) => {
                await role.save({ transaction: t });
                await database.RolePermission.bulkCreate(permissionList, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while saving role: ', err);
            throw new Errors.BadRequest('Invalid data. Role creation failed.');
        }

        return {
            id: role.id,
            name: role.name,
            permissions,
        };
    }

    /**
      * Gets role with given id.
      * @param {string} id Id of the role to delete
      * @returns {Promise<Object>} the retrieved Role object
      */
    static async GetRole(id) {
        const database = await getDatabase();

        const role = await database.Role.findOne({ where: { id } });

        // check if the role exist
        if (!role) {
            throw new Errors.BadRequest(`Role ${id} does not exist.`);
        }

        try {
            const permissionInstances = await database.RolePermission.findAll({
                where: { roleId: id },
            });
            const permissions = permissionInstances.map((permission) => (
                permission.permissionId
            ));
            return {
                id,
                name: role.name,
                permissions,
            };
        } catch (err) {
            logger.error('Error while getting role permissions: ', err);
            throw new Errors.BadRequest('Invalid data. Role retrieval failed.');
        }
    }

    /**
      * Deletes role with given id.
      * @param {string} id Id of the role to delete
      */
    static async DeleteRole(id) {
        const database = await getDatabase();

        const existingRole = await database.Role.findOne({ where: { id } });

        if (!existingRole) {
            throw new Errors.BadRequest(`Role ${id} does not exist.`);
        }

        // Protect base roles
        if (existingRole.name === 'Student' || existingRole.name === 'Administrator') {
            throw new Errors.BadRequest('Student/Administrator Roles cannot be deleted.');
        }

        // role,rolePermission deleted within a transaction
        try {
            await database.sequelize.transaction(async (t) => {
                await existingRole.destroy({}, { transaction: t });
                await database.RolePermission.destroy({
                    where: {
                        roleId: id,
                    },
                }, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while deleting role: ', err);
            throw new Errors.BadRequest('Invalid data. Lab deletion failed.');
        }
    }

    /**
     * Updates role with given id.
     * All fields will be overridden by new ones.
     * @param {Object} role Role object to create
     * @param {string} role.id ID of Role
     * @param {string} role.name Name of Role
     * @param {string} permissions permissions of Role
     * @returns {Promise<Object>} Created Role object
     */
    static async UpdateRole({ id, name, permissions }) {
        const database = await getDatabase();

        const existingRole = await database.Role.findOne({ where: { id } });

        if (!existingRole) {
            throw new Errors.BadRequest(`Role ${id} does not exist.`);
        }

        const sameNameRole = await database.Role.findOne({ where: { name } });
        if (sameNameRole && sameNameRole.id !== id) {
            throw new Errors.BadRequest(`Another role with the name ${name} is already created. Role name must be unique`);
        }

        // Protect base roles
        if (existingRole.name === 'Student' || existingRole.name === 'Administrator') {
            throw new Errors.BadRequest('Student/Administrator Roles cannot be updated.');
        }

        const permissionList = permissions.map((permissionId) => ({
            roleId: id,
            permissionId,
        }));

        // 1. delete the role permission
        // 2. create new role permission
        // 3. update the role (all within the transaction)
        try {
            const role = await database.sequelize.transaction(async (t) => {
                await database.RolePermission.destroy({
                    where: {
                        roleId: id,
                    },
                    transaction: t,
                });

                await database.RolePermission.bulkCreate(permissionList, { transaction: t });
                return existingRole.update({ id, name }, { transaction: t });
            });

            return {
                id,
                name: role.name,
                permissions,
            };
        } catch (err) {
            logger.error('Error while updating role: ', err);
            throw new Errors.BadRequest('Invalid data. Role update failed.');
        }
    }
}


module.exports = RolesService;
