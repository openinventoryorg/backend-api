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
   * @param {array} rolePermissions Permissions for the role
   * @returns {Promise<Object>} Created role object
   */
    static async CreateRole({ name, rolePermissions }) {
        const database = await getDatabase();
        const role = database.Role.build({ name });
        const roleId = role.id;
        const permissionList = rolePermissions.map((permissionId) => ({ roleId, permissionId }));
        try {
            await role.save();
        } catch (err) {
            logger.error('Error while saving role: ', err);
            throw new Errors.BadRequest('Invalid data. Role creation failed.');
        }
        try {
            await database.RolePermission.bulkCreate(permissionList);
        } catch (err) {
            logger.error('Error while saving role permission: ', err);
            throw new Errors.BadRequest('Invalid data. role_permission creation failed.');
        }

        return {
            id: role.id,
            name: role.name,
            updatedAt: role.updatedAt,
            createdAt: role.createdAt,
            permissions: rolePermissions,
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

        if (!role) {
            throw new Errors.BadRequest(`Role ${id} does not exist.`);
        }

        try {
            const permissionInstances = await database.RolePermission.findAll({
                where: { roleId: id },
            });
            const rolePermissions = permissionInstances.map((permission) => (
                permission.permissionId
            ));
            return {
                id,
                name: role.name,
                updatedAt: role.updatedAt,
                createdAt: role.createdAt,
                permissions: rolePermissions,
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
   * @param {string} rolePermissions permissions of Role
   * @returns {Promise<Object>} Created Role object
   */
    static async UpdateRole({ id, name, rolePermissions }) {
        const database = await getDatabase();

        const existingRole = await database.Role.findOne({ where: { id } });


        if (!existingRole) {
            throw new Errors.BadRequest(`Role ${id} does not exist.`);
        }
        const permissionList = rolePermissions.map((permissionId) => ({
            roleId: id,
            permissionId,
        }));

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
                updatedAt: role.updatedAt,
                createdAt: role.createdAt,
                permissions: rolePermissions,
            };
        } catch (err) {
            logger.error('Error while updating role: ', err);
            throw new Errors.BadRequest('Invalid data. Role update failed.');
        }
    }
}


module.exports = RolesService;
