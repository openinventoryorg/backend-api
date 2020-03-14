const LoginService = require('../services/login');
const { LoginInformation } = require('./validators/login');

/**
 * Controller which handles user login
 * @abstract
 * @category Controllers
 */
class LoginController {
    /**
     * Logs a user in and gives the user a token.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async Login(req, res, next) {
        try {
            const { value, error } = LoginInformation.validate(req.body);
            if (error) throw error;

            const registrationTokenData = await LoginService.Login(value.email, value.password);
            res.status(200).send(registrationTokenData);
        } catch (err) {
            next(err);
        }
    }
}


module.exports = LoginController;
