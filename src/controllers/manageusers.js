const ListService = require('../services/list');
const UserService = require('../services/users');
const { UserIdQuery, UpdateUserQuery } = require('./validators/manageusers');

class ManageUserController {
    static async ListUsers(req, res, next) {
        try {
            const users = await ListService.ListUsers();
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }

    static async DeleteUsers(req, res, next) {
        try {
            const { value, error } = UserIdQuery.validate({ id: req.params.id });

            if (error) throw (error);

            await UserService.DeleteUsers(value.id);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    static async UpdateUsers(req, res, next) {
        try {
            const { value, error } = UpdateUserQuery.validate({
                ...req.body,

            });
            if (error) throw (error);

            await UserService.UpdateUsers(value);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageUserController;
