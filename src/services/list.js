const { getDatabase } = require('../helpers/get_database');

class ListService {
    static async ListRoles() {
        const database = await getDatabase();
        const roles = await database.Role.findAll({
            attributes: ['id', 'name'],
        });
        return { roles };
    }
}

module.exports = ListService;

// await database.Role.create({ id: 'UUID4', name: 'Student' });
// await database.Role.create({ id: 'UUID4', name: 'Administrator' });
// await database.RolePermission.create({ permissionId: 'REQUESTER', roleId: 'STUDENT_ROLE_ID' });
