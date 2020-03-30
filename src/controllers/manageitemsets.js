const ItemsetsService = require('../services/itemsets');
const ListService = require('../services/list');
const { CreateItemset, ItemsetIdQuery, CreateItemsetQuery } = require('./validators/manageitemsets');

/**
 * Controller which manages itemsets
 * @abstract
 * @category Controllers
 */
class ManageItemsetsController {
    /**
     * Creates a new itemset.
     *
     * This creates a new itemset and returns details including ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async PostItemset(req, res, next) {
        try {
            const { value, error } = CreateItemset.validate(req.body);
            if (error) throw error;
            const itemset = await ItemsetsService.CreateItemset(value);
            res.status(200).send(itemset);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets an existing itemset with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async GetItemset(req, res, next) {
        try {
            const { value, error } = ItemsetIdQuery.validate({ id: req.params.id });
            if (error) throw error;
            const itemset = await ItemsetsService.GetItemset(value.id);
            res.status(200).send(itemset);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Deletes an existing itemset with given id.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async DeleteItemset(req, res, next) {
        try {
            const { value, error } = ItemsetIdQuery.validate({ id: req.params.id });
            if (error) throw error;

            await ItemsetsService.DeleteItemset(value.id);
            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Updates itemset details with given details and ID.
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async UpdateItemset(req, res, next) {
        try {
            const { value, error } = CreateItemsetQuery.validate({
                ...req.body,
                id: req.params.id,
            });
            if (error) throw error;

            const itemset = await ItemsetsService.UpdateItemset(value);
            res.status(200).send(itemset);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Gets a list of itemsets available in the system
     * @param {Request} req Request
     * @param {Response} res Response
     * @param {NextFunction} next Next callback
     */
    static async ListItemsets(req, res, next) {
        try {
            const itemsets = await ListService.ListItemsets();
            res.status(200).send(itemsets);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ManageItemsetsController;
