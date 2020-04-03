const ListService = require('../services/list');

class ManageUserController {
    static async ListUsers(req, res, next) {
        try {
            const users = await ListService.ListUsers();
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageUserController;
