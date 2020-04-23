const SupervisorsService = require('../services/supervisors');
const ListService = require('../services/list');
const {
    CreateSupervisor, SupervisorIdQuery,
} = require('./validators/managesupervisors');

/**
 * Supervisors which manages supervisors
 * @abstract
 * @category Supervisorss
 */
class ManageSupervisorsSupervisors {
    /**
     * Creates a new supervisor.
     *
     * This creates a new supervisor and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostSupervisor(req, res, next) {
        try {
            const { value, error } = CreateSupervisor.validate(req.body);
            if (error) throw error;

            const supervisor = await SupervisorsService.CreateSupervisor(value);
            res.status(200).send(supervisor);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes an existing supervisor with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteSupervisor(req, res, next) {
        try {
            const { value, error } = SupervisorIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            await SupervisorsService.DeleteSupervisor(value.id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets a list of supervisors avaisupervisorle in the system
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListSupervisors(req, res, next) {
        try {
            const supervisors = await ListService.ListSupervisors();
            res.status(200).send(supervisors);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageSupervisorsSupervisors;
