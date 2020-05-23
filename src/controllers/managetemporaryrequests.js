const { CreateTemporaryLendRequests } = require('./validators/managetemporaryrequests');
const TemporaryRequestsService = require('../services/temporaryrequests');

/**
* Controller which manages temporary requests
* @abstract
* @category Controllers
*/
class ManageTemporaryRequestsController {
    /**
   * Creates/Completes a new temporary request for an item.
   *
   * This creates/completes a temporary request and returns temporary request.
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next Next callback
   */
    static async ManageTemporaryLendRequest(req, res, next) {
        try {
            const { value, error } = CreateTemporaryLendRequests.validate(req.body);
            if (error) throw error;
            const temporaryRequest = await TemporaryRequestsService.ManageTemporaryRequest(value);
            res.status(200).send(temporaryRequest);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageTemporaryRequestsController;
