const RolesService = require('../services/roles');
const ListService = require('../services/list');
const { CreateRole, RoleIdQuery, CreateRoleQuery } = require('./validators/manageroles');

/**
 * Controller which manages roles
 * @abstract
 * @category Controllers
 */
class ManageRolesController {
    /**
     * Creates a new role.
     *
     * This creates a new role and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostRole(req, res, next) {
        try {
            const { value, error } = CreateRole.validate(req.body);
            if (error) throw error;
            const role = await RolesService.CreateRole(value);
            res.status(200).send(role);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets an existing role with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async GetRole(req, res, next) {
        try {
            const { value, error } = RoleIdQuery.validate({ id: req.params.id });
            if (error) throw error;
            const role = await RolesService.GetRole(value.id);
            res.status(200).send(role);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes an existing role with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteRole(req, res, next) {
        try {
            const { value, error } = RoleIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            await RolesService.DeleteRole(value.id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Updates role details with given details and ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UpdateRole(req, res, next) {
        try {
            const { value, error } = CreateRoleQuery.validate({
                ...req.body,
                id: req.params.id,
            });
            if (error) throw error;

            const role = await RolesService.UpdateRole(value);
            res.status(200).send(role);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets a list of roles available in the system
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListRoles(req, res, next) {
        try {
            const roles = await ListService.ListRoles();
            res.status(200).send(roles);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageRolesController;
