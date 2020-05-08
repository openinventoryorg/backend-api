const ManageSupervisorsService = require('../services/supervisors');
const ListService = require('../services/list');
const { CreateSupervisor } = require('./validators/managesupervisors');

/**
 * Controller which manages supervisors
 * @abstract
 * @category Controllers
 */
class ManageSupervisorsController {
    /**
     * Creates a new supervisor.
     *
     * This creates a new supervisor and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async CreateSupervisor(req, res, next) {
        try {
            const { value, error } = CreateSupervisor.validate(req.body);
            if (error) throw error;

            const supervisor = await ManageSupervisorsService.CreateSupervisor(value);
            res.status(200).send(supervisor);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageSupervisorsController;
