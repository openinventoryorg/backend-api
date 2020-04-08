const ListService = require('../services/list');
const UserService = require('../services/users');
const { UserIdQuery, UpdateUserQuery } = require('./validators/manageusers');

class ManageUserController {
    /**
     * Lists users
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListUsers(req, res, next) {
        try {
            const users = await ListService.ListUsers();
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deletes a user with given ID
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteUser(req, res, next) {
        try {
            const { value, error } = UserIdQuery.validate({ id: req.params.id });
            if (error) throw (error);

            await UserService.DeleteUser(value.id);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Updates first name and last name of a user given with the id
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UpdateUser(req, res, next) {
        try {
            const { value, error } = UpdateUserQuery.validate({ ...req.body, id: req.params.id });
            if (error) throw (error);

            await UserService.UpdateUser(value);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lists users with the permission of inventory managers
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListInventoryManagers(req, res, next) {
        try {
            const inventoryManagers = await ListService.ListInventoryManagers();
            res.status(200).send(inventoryManagers);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageUserController;
