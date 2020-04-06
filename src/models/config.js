const logger = require('../loaders/logger');

const configureInitialDatabase = async (database) => {
    try {
        await database.sequelize.transaction(async (t) => {
            const studentRole = database.Role.build({
                name: 'student',
                RolePermissions: [
                    { permissionId: database.Permission.Requester },
                ],
            }, { include: database.RolePermission });
            const adminRole = database.Role.build({
                name: 'administrator',
                RolePermissions: [
                    { permissionId: database.Permission.Administrator },
                ],
            }, { include: database.RolePermission });

            await studentRole.save({ transaction: t });
            await adminRole.save({ transaction: t });
        });
    } catch (err) {
        logger.error(err);
    }
};

module.exports = configureInitialDatabase;
