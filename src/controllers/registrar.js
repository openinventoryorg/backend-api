const RegistrarService = require('../services/registrar');
const ListService = require('../services/list');
const { RegistrationTokenGenerationRequest, EmailBasedRequest, RegistrationTokenListRequest } = require('./validators/registrar');

/**
 * Controller which associates registration tokens with users
 * @abstract
 * @category Controllers
 */
class RegistrarController {
    /**
     * Creates email tokens for the specified users on the given role
     * If token creation failed for at least one user, tokens won't get created.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostTokens(req, res, next) {
        try {
            const { value, error } = RegistrationTokenListRequest.validate(req.body);
            if (error) throw error;

            await RegistrarService
                .SendRegistrationTokenList(value.emails, value.role);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Creates a email token for the specified user on the given role
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PutToken(req, res, next) {
        try {
            const { value, error } = RegistrationTokenGenerationRequest.validate(req.body);
            if (error) throw error;

            await RegistrarService
                .SendRegistrationToken(value.email, value.role);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes the email token associated with a user
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteToken(req, res, next) {
        try {
            const { value, error } = EmailBasedRequest.validate(req.body);
            if (error) throw error;

            await RegistrarService.DeleteRegistrationToken(value.email);
            res.sendStatus(200);
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

module.exports = RegistrarController;
