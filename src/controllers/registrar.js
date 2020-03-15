const RegistrarService = require('../services/registrar');
const ListService = require('../services/list');
const { RegistrationTokenGenerationRequest, EmailBasedRequest } = require('./validators/registrar');

/**
 * Controller which associates registration tokens with users
 * @abstract
 * @category Controllers
 */
class RegistrarController {
    /**
     * Creates a email token for the specified user on the given role
     * @param {any} req Request
     * @param {any} res Response
     * @param {any} next Next callback
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
     * @param {any} req Request
     * @param {any} res Response
     * @param {any} next Next callback
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
     * @param {any} req Request
     * @param {any} res Response
     * @param {any} next Next callback
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
