const LabsService = require('../services/labs');
const ListService = require('../services/list');
const { CreateLab, LabIdQuery, CreateLabQuery } = require('./validators/managelabs');

/**
 * Controller which manages labs
 * @abstract
 * @category Controllers
 */
class ManageLabsController {
    /**
     * Creates a new lab.
     *
     * This creates a new lab and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostLab(req, res, next) {
        try {
            const { value, error } = CreateLab.validate(req.body);
            if (error) throw error;

            const lab = await LabsService.CreateLab(value);
            res.status(200).send(lab);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Creates a lab with given id and details.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PutLab(req, res, next) {
        try {
            const { value, error } = CreateLabQuery.validate({
                id: req.params.id,
                ...req.body,
            });
            if (error) throw error;

            const lab = await LabsService.PutLab(value);
            res.status(200).send(lab);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes an existing lab with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteLab(req, res, next) {
        try {
            const { value, error } = LabIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            await LabsService.DeleteLab(value.id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Updates lab details with given details and ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UpdateLab(req, res, next) {
        try {
            const { value, error } = CreateLabQuery.validate({
                ...req.body,
                id: req.params.id,
            });
            if (error) throw error;

            const lab = await LabsService.UpdateLab(value);
            res.status(200).send(lab);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets a list of labs available in the system
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListLabs(req, res, next) {
        try {
            const labs = await ListService.ListLabs();
            res.status(200).send(labs);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageLabsController;
