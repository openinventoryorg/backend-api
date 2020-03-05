const uuid = require('uuid');
const databasePromise = require('../src/models');
const { SendRegistrationToken } = require('../src/services/registrar');
const logger = require('../src/loaders/logger');

async function main() {
    try {
        const arg = process.argv[2];
        const database = await databasePromise;

        // Format: npm run manage init admin@admin.com
        if (arg === 'init') {
            const adminEmail = process.argv[3];
            const studentRoleId = uuid.v4();
            const adminRoleId = uuid.v4();

            // Student Role
            await database.Role.create({
                id: studentRoleId,
                name: database.Permission.Requester,
            });

            // Administrator Role
            await database.Role.create({
                id: adminRoleId,
                name: database.Permission.Administrator,
            });

            // Permissions of student
            await database.RolePermission.create({
                permissionId: database.Permission.Requester,
                roleId: studentRoleId,
            });

            // Permissions of administrator
            await database.RolePermission.create({
                permissionId: database.Permission.Administrator,
                roleId: adminRoleId,
            });

            await SendRegistrationToken(adminEmail, adminRoleId);
        }
    } catch (err) {
        logger.error(err);
    }
}

main();
