const LendService = require('../services/lend');
const { LendInformation } = require('./validators/lend');

/**
 * Controller which handles item lending
 * @abstract
 * @category Controllers
 */
class LendController {
    /**
     * Lends a list of items to a user
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async Lend(req, res, next) {
        try {
            const { value, error } = LendInformation.validate({ ...req.body, userId: req.user.id });
            if (error) throw error;

            const registrationTokenData = await LendService.Lend(value);
            res.status(200).send(registrationTokenData);
        } catch (err) {
            next(err);
        }
    }
}


module.exports = LendController;
