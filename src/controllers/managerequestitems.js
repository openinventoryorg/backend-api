const { createItemsRequest, getItemsRequest, getItemsRequestAction } = require('./validators/manageitemsrequest');
const ItemsRequestService = require('../services/itemsRequest');
/**
 * Controller which manages request items
 * @abstract
 * @category Controllers
 */
class ManageRequestItemsController {
    /**
     * Creates a new items request.
     *
     * This creates a new items request and returns items request Id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async CreateItemsRequest(req, res, next) {
        try {
            const { value, error } = createItemsRequest.validate(req.body);
            if (error) throw error;
            const itemsRequest = await ItemsRequestService.CreateItemsRequest(value);
            res.status(200).send(itemsRequest);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Gets an item request by its token
     *
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async GetItemsRequestByToken(req, res, next) {
        try {
            const { value, error } = getItemsRequest.validate({ token: req.params.token });
            if (error) throw error;
            const itemsRequest = await ItemsRequestService.GetItemsRequestByToken(value);
            res.status(200).send(itemsRequest);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Accept or reject request
     *
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async GetRequestAction(req, res, next) {
        try {
            const { value, error } = getItemsRequestAction.validate(req.body);
            if (error) throw error;
            await ItemsRequestService.AcceptOrDeclineRequest(value);
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageRequestItemsController;
