const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CRUD of itemsets
 * @abstract
 * @category Services
 */
class ItemsetsService {
    /**
     * Creates an itemset with given data.
     * Id will be automatically generated.
     * @param {Object} itemset Itemset object to create
     * @param {string} itemset.title title of itemset
     * @param {string} itemset.image URI of the image
     * @param {array} attributes Attributes for the itemset
     * @returns {Promise<Object>} Created itemset object
     */
    static async CreateItemset({ title, image, attributes }) {
        // get database connection
        const database = await getDatabase();

        // check for same name itemsets - name should be unique
        const sameNameItemset = await database.ItemSet.findOne({ where: { title } });
        if (sameNameItemset) {
            throw new Errors.BadRequest(`An itemset with the title ${title} is already created. Itemset title must be unique`);
        }
        const itemset = database.ItemSet.build({ title, image });
        const itemSetId = itemset.id;
        const attributeList = attributes.map((attribute) => ({ itemSetId, ...attribute }));
        // the operations of saving `itemset`, `attributelist` are done through an sql transaction
        // An async callback is passed into the transaction
        // A transaction is automatically started and transaction object t is obtained
        // If callback success commit, else rollback
        try {
            await database.sequelize.transaction(async (t) => {
                await itemset.save({ transaction: t });
                await database.Attribute.bulkCreate(attributeList, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while saving itemset: ', err);
            throw new Errors.BadRequest('Invalid data. itemset creation failed.');
        }

        return {
            id: itemset.id,
            title,
            image,
            attributes,
        };
    }

    /**
      * Gets an itemset with given id.
      * @param {string} id Id of the itemset to retrieve
      * @returns {Promise<Object>} the retrieved itemset object
      */
    static async GetItemset(id) {
        const database = await getDatabase();

        const itemset = await database.ItemSet.findOne({ where: { id } });

        // check if the itemset exist
        if (!itemset) {
            throw new Errors.BadRequest(`Itemset ${id} does not exist.`);
        }

        try {
            const attributeInstances = await database.Attribute.findAll({
                where: { itemSetId: id },
            });
            const attributes = attributeInstances.map((attribute) => ({
                key: attribute.key,
                editable: attribute.editable,
                defaultValue: attribute.defaultValue,
            }));
            return {
                id: itemset.id,
                title: itemset.title,
                image: itemset.image,
                attributes,
            };
        } catch (err) {
            logger.error('Error while getting itemset attributes: ', err);
            throw new Errors.BadRequest('Invalid data. Itemset retrieval failed.');
        }
    }

    /**
      * Deletes itemset with given id.
      * @param {string} id Id of the itemset to delete
      */
    static async DeleteItemset(id) {
        const database = await getDatabase();

        const existingItemset = await database.ItemSet.findOne({ where: { id } });

        if (!existingItemset) {
            throw new Errors.BadRequest(`Itemset ${id} does not exist.`);
        }

        // itemset,attributes deleted within a transaction
        try {
            await database.sequelize.transaction(async (t) => {
                await database.Attribute.destroy({
                    where: {
                        itemSetId: id,
                    },
                }, { transaction: t });
                await existingItemset.destroy({}, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while deleting itemset: ', err);
            throw new Errors.BadRequest('Invalid data. Item creation deletion failed.');
        }
    }

    /**
     * Updates itemset with given id.
     * All fields will be overridden by new ones.
     * @param {Object} itemset Itemset object to create
     * @param {string} itemset.id ID of Itemset
     * @param {string} itemset.title title of itemset
     * @param {string} itemset.image URI of the image
     * @param {array} attributes Attributes for the itemset
     * @returns {Promise<Object>} Created itemset object
     */
    static async UpdateItemset({
        id, title, image, attributes,
    }) {
        const database = await getDatabase();

        const existingItemset = await database.ItemSet.findOne({ where: { id } });

        if (!existingItemset) {
            throw new Errors.BadRequest(`Itemset ${id} does not exist.`);
        }

        const sameNameItemset = await database.ItemSet.findOne({ where: { title } });
        if (sameNameItemset && sameNameItemset.id !== id) {
            throw new Errors.BadRequest(`Another itemset with the name ${title} is already created. Itemset name must be unique`);
        }

        const attributeList = attributes.map((attribute) => ({ itemSetId: id, ...attribute }));

        // 1. delete the itemset attributes
        // 2. create new itemset attributes
        // 3. update the itemset (all within the transaction)
        try {
            const itemset = await database.sequelize.transaction(async (t) => {
                await database.Attribute.destroy({
                    where: {
                        itemSetId: id,
                    },
                    transaction: t,
                });

                await database.Attribute.bulkCreate(attributeList, { transaction: t });
                return existingItemset.update({ id, title, image }, { transaction: t });
            });

            return {
                id: itemset.id,
                title: itemset.title,
                image: itemset.image,
                attributes,
            };
        } catch (err) {
            logger.error('Error while updating itemset: ', err);
            throw new Errors.BadRequest('Invalid data. Itemset update failed.');
        }
    }
}


module.exports = ItemsetsService;
