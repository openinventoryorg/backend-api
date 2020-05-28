const { CreateTemporaryLendRequests, ListRequestsUsingLab } = require('./validators/managetemporaryrequests');
const TemporaryRequestsService = require('../services/temporaryrequests');
const ListService = require('../services/list');


/**
* Controller which manages temporary requests
* @abstract
* @category Controllers
*/
class ManageTemporaryRequestsController {
    /**
   * Creates a new temporary request for an item.
   *
   * This creates a temporary request and returns temporary request.
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next Next callback
   */
    static async CreateTemporaryLendRequest(req, res, next) {
        try {
            const { value, error } = CreateTemporaryLendRequests.validate({
                userId: req.user.id, userPermissions: req.user.permissions, ...req.body,
            });
            if (error) throw error;
            const temporaryRequest = await TemporaryRequestsService.CreateTemporaryRequest(value);
            res.status(200).send(temporaryRequest);
        } catch (error) {
            next(error);
        }
    }

    /**
   * Updates a temporary request to return status for an item.
   *
   * This completes a temporary request and returns temporary request.
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next Next callback
   */
    static async UpdateTemporaryLendRequest(req, res, next) {
        try {
            const { value, error } = CreateTemporaryLendRequests.validate({
                userId: req.user.id, userPermissions: req.user.permissions, ...req.body,
            });
            if (error) throw error;
            const temporaryRequest = await TemporaryRequestsService.UpdateTemporaryRequest(value);
            res.status(200).send(temporaryRequest);
        } catch (error) {
            next(error);
        }
    }

    /**
   * Lists all the temporary requests of a given inventory manager
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next Next callback
   */
    static async ListTemporaryLendRequests(req, res, next) {
        try {
            const { value, error } = ListRequestsUsingLab.validate({ userId: req.user.id });
            if (error) throw error;
            const temporaryRequests = await ListService.ListTemporaryLendRequestsByLab(value);
            res.status(200).send({ lentItems: temporaryRequests });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageTemporaryRequestsController;
