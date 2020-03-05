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
