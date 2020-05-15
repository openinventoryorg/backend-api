const LabsService = require('../services/labs');
const ListService = require('../services/list');
const {
    CreateLab, LabIdQuery, CreateLabQuery, LabAndUserQuery,
} = require('./validators/managelabs');

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

    /**
     * Gets a lists of the items available in the specified lab
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListLabItems(req, res, next) {
        try {
            const { value, error } = LabIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            const labs = await ListService.ListLabItems(value.id);
            res.status(200).send(labs);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Assigns a user with a given userId to a lab with a given labId
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async AssignUserstoLabs(req, res, next) {
        try {
            const { value, error } = LabAndUserQuery.validate(req.body);
            if (error) throw error;

            await LabsService.AssignUserstoLabs(value);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Assigns a user with a given userId to a lab with a given labId
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UnassignUsersFromLabs(req, res, next) {
        try {
            const { value, error } = LabAndUserQuery.validate(req.body);
            if (error) throw error;

            await LabsService.UnassignUsersFromLabs(value);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * List all the users assigned to a given lab
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListAssignedUsers(req, res, next) {
        try {
            const { value, error } = LabIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            const users = await ListService.ListUsersAssignedToLab(value);
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageLabsController;
