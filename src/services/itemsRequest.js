const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CRUD of items request
 * @abstract
 * @category Services
 */
class ItemsRequestService {
    /**
     * Creates an items request with given data.
     * Id will be automatically generated.
     * @param {Object} item Item object to create
     * @param {string} item.serialNumber serial number of item, must be unique
     * @param {string} item.itemSetId ID of the item set this belongs to
     * @param {string} item.labId ID of the lab this belongs to
     * @param {array} item.attributes Attributes for the item
     * @returns {Promise<Object>} Created item object
     */
    static async createItemsRequest({
        itemIds, title, supervisorId, reason, userId,
    }) {
        const itemTransactionPool = [];
        let [requestId, status] = '';
        const database = await getDatabase();
        const request = {
            title, userId, supervisorId, reason,
        };
        itemIds.forEach(async (itemId) => {
            const itemRequest = { itemId };
            itemTransactionPool.push(itemRequest);
        });
        try {
            await database.sequelize.transaction(async (t) => {
                await database.Request.create(request);
                await database.RequestItem.bulkCreate(itemTransactionPool, { transaction: t });
                [requestId, status] = await database.Request.findAll({ limit: 1, attributes: ['id', 'status'], order: [['createdAt', 'DESC']] });
            });
        } catch (err) {
            logger.error('Error while saving item: ', err);
            throw new Errors.BadRequest('Invalid data. item request creation failed.');
        }
        return {
            itemIds,
            requestId,
            title,
            supervisorId,
            status,
        };
    }
}

module.exports = ItemsRequestService;
