const { createItemsRequest } = require('./validators/manageitemsrequest');
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
            const itemsRequest = await ItemsRequestService.createItemsRequest(value);
            res.status(200).send(itemsRequest);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ManageRequestItemsController;
