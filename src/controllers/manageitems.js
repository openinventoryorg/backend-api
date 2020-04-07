const ItemService = require('../services/items');
const ListService = require('../services/list');
const {
    CreateItem, UpdateItem, ItemIdQuery, ItemTransferQuery,
} = require('./validators/manageitems');

/**
 * Controller which manages items
 * @abstract
 * @category Controllers
 */
class ManageItemsController {
    /**
     * Creates a new item.
     *
     * This creates a new item and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostItem(req, res, next) {
        try {
            const { value, error } = CreateItem.validate(req.body);
            if (error) throw error;
            const item = await ItemService.CreateItem(value);
            res.status(200).send(item);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets an existing item with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async GetItem(req, res, next) {
        try {
            const { value, error } = ItemIdQuery.validate({ id: req.params.id });
            if (error) throw error;
            const item = await ItemService.GetItem(value.id);
            res.status(200).send(item);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes an existing item with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteItem(req, res, next) {
        try {
            const { value, error } = ItemIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            await ItemService.DeleteItem(value.id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Updates item details with given details and ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UpdateItem(req, res, next) {
        try {
            const { value, error } = UpdateItem.validate({
                ...req.body,
                id: req.params.id,
            });
            if (error) throw error;

            const item = await ItemService.UpdateItem(value);
            res.status(200).send(item);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets a list of items available in the system
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListItems(req, res, next) {
        try {
            const items = await ListService.ListItems();
            res.status(200).send(items);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Transfers an item from one lab to another
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async TransferItem(req, res, next) {
        try {
            const { value, error } = ItemTransferQuery.validate(req.body);
            if (error) throw error;
            await ItemService.TransferItem(value);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageItemsController;
