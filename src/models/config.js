const logger = require('../loaders/logger');

const configureInitialDatabase = async (database) => {
    try {
        await database.sequelize.transaction(async (t) => {
            const permissionArray = database.Permission.permissions.map((permission) => (
                { permissionId: permission }));

            const studentRole = database.Role.build({
                name: 'student',
                RolePermissions: [
                    { permissionId: database.Permission.Requester },
                ],
            }, { include: database.RolePermission });
            const adminRole = database.Role.build({
                name: 'administrator',
                RolePermissions: permissionArray,
            }, { include: database.RolePermission });

            await studentRole.save({ transaction: t });
            await adminRole.save({ transaction: t });
        });
    } catch (err) {
        logger.error(err);
    }
};

module.exports = configureInitialDatabase;
