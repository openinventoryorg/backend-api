const ListService = require('../services/list');

/**
 * Controller which manages permissions
 * @abstract
 * @category Controllers
 */
class ManagePermissionsController {
    /**
   * List all the available permissions
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next Next callback
   */
    static async ListRolePermissions(req, res, next) {
        try {
            const permissions = await ListService.ListRolePermissions();
            res.status(200).send(permissions);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManagePermissionsController;
