const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CRUD of items
 * @abstract
 * @category Services
 */
class ItemService {
    static JoinItemSetAttributes(itemSetAttribs, itemAttribs, itemId) {
        const lockedAttribs = new Set();
        const mappedParentAttribs = {};
        itemSetAttribs.forEach(({ key, defaultValue, editable }) => {
            if (!editable) lockedAttribs.add(key);
            mappedParentAttribs[key] = defaultValue;
        });
        itemAttribs.forEach(({ key, value }) => {
            if (lockedAttribs.has(key)) throw new Errors.BadRequest(`Cannot modify a locked attribute: ${key}`);
            mappedParentAttribs[key] = value;
        });

        const attributeList = Object.entries(mappedParentAttribs)
            .map(([key, value]) => ({ itemId, key, value }));

        return attributeList;
    }


    /**
     * Creates an item with given data.
     * Id will be automatically generated.
     * Note: Attributes will be merged with item set attributes.
     * @param {Object} item Item object to create
     * @param {string} item.serialNumber serial number of item, must be unique
     * @param {string} item.itemSetId ID of the item set this belongs to
     * @param {string} item.labId ID of the lab this belongs to
     * @param {array} item.attributes Attributes for the item
     * @returns {Promise<Object>} Created item object
     */
    static async CreateItem({
        serialNumber, itemSetId, labId, attributes,
    }) {
        const database = await getDatabase();

        const sameSNItem = await database.Item.findOne({ where: { serialNumber } });
        if (sameSNItem) {
            throw new Errors
                .BadRequest(`An item with the Serial Number ${serialNumber} is already created. Serial Number must be unique.`);
        }

        const itemSet = await database.ItemSet.findOne({
            where: { id: itemSetId },
            include: [{
                model: database.Attribute,
                attributes: ['key', 'defaultValue', 'editable'],
            }],
        });
        if (!itemSet) {
            throw new Errors.BadRequest('Item set does not exist.');
        }

        const lab = await database.Lab.findOne({ where: { id: labId } });
        if (!lab) {
            throw new Errors.BadRequest('Lab does not exist.');
        }

        const item = database.Item.build({ serialNumber, itemSetId, labId });
        const attributeList = ItemService
            .JoinItemSetAttributes(itemSet.Attributes, attributes, item.id);

        try {
            await database.sequelize.transaction(async (t) => {
                await item.save({ transaction: t });
                await database.ItemAttribute.bulkCreate(attributeList, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while saving item: ', err);
            throw new Errors.BadRequest('Invalid data. item creation failed.');
        }

        return {
            id: item.id,
            serialNumber,
            itemSetId,
            labId,
            attributes,
        };
    }

    /**
      * Gets an item with given id.
      * @param {string} id Id of the item to retrieve
      * @returns {Promise<Object>} the retrieved item object
      */
    static async GetItem(id) {
        const database = await getDatabase();

        const item = await database.Item.findOne({
            where: { id },
            attributes: ['id', 'serialNumber'],
            include: [
                {
                    model: database.ItemSet,
                    attributes: ['id', 'title', 'image'],
                },
                {
                    model: database.Lab,
                    attributes: ['id', 'title', 'subtitle', 'image'],
                },
                {
                    model: database.ItemAttribute,
                    attributes: ['key', 'value'],
                },
            ],
        });

        // check if the item exist
        if (!item) {
            // console.log(item);
            throw new Errors.BadRequest('Item does not exist.');
        }

        return {
            id: item.id,
            serialNumber: item.serialNumber,
            ItemSet: item.ItemSet,
            Lab: item.Lab,
            ItemAttributes: item.ItemAttributes,
        };
    }

    /**
      * Deletes item with given id.
      * @param {string} id Id of the item to delete
      */
    static async DeleteItem(id) {
        const database = await getDatabase();

        const existingItem = await database.Item.findOne({ where: { id } });

        if (!existingItem) {
            throw new Errors.BadRequest('Item does not exist.');
        }

        // item,attributes deleted within a transaction
        try {
            await database.sequelize.transaction(async (t) => {
                await database.ItemAttribute.destroy({
                    where: {
                        itemId: id,
                    },
                }, { transaction: t });
                await existingItem.destroy({}, { transaction: t });
            });
        } catch (err) {
            logger.error('Error while deleting item: ', err);
            throw new Errors.BadRequest('Invalid data. Item deletion failed.');
        }
    }

    /**
     * Updates item with given id.
     * All previous item attributes are removed and replaced
     * The itemset attributes remain but editable ITset attribute values may get changed
     * @param {Object} item Item object to create
     * @param {string} item.id ID of Item
     * @param {array} item.attributes Attributes for the item
     * @returns {Promise<Object>} Created item object
     */
    static async UpdateItem({ id, attributes }) {
        const database = await getDatabase();

        const item = await database.Item.findOne({
            where: { id },
            include: [
                {
                    model: database.ItemAttribute,
                    attributes: ['key', 'value'],
                },
                {
                    model: database.ItemSet,
                    attributes: ['id'],
                    include: [
                        {
                            model: database.Attribute,
                            attributes: ['key', 'defaultValue', 'editable'],
                        },
                    ],
                },
            ],
        });
        if (!item) {
            throw new Errors.BadRequest(`Item ${id} does not exist.`);
        }
        const attributeList = ItemService
            .JoinItemSetAttributes(
                item.ItemSet.Attributes,
                attributes,
                item.id,
            );

        try {
            await database.sequelize.transaction(async (t) => {
                await database.ItemAttribute.destroy({
                    where: { itemId: id },
                    transaction: t,
                });
                await database.ItemAttribute.bulkCreate(attributeList, { transaction: t });
            });

            return {
                id: item.id,
                serialNumber: item.serialNumber,
                attributes: attributeList,
            };
        } catch (err) {
            logger.error('Error while updating item: ', err);
            throw new Errors.BadRequest('Invalid data. Item update failed.');
        }
    }

    /**
     * Transfer an item from one lab to another
     * @param {string} id ID of Item
     * @param {array} labId ID of a lab
     */
    static async TransferItem({ id, labId }) {
        const database = await getDatabase();

        const item = await database.Item.findOne({ where: { id } });
        const lab = await database.Lab.findOne({ where: { id: labId } });

        if (!item) {
            throw new Errors.BadRequest(`Item ${id} does not exist.`);
        } else if (!lab) {
            throw new Errors.BadRequest(`Lab ${labId} does not exist.`);
        }

        try {
            await item.update({ labId });
        } catch (err) {
            logger.error('Error while transferring item: ', err);
            throw new Errors.BadRequest('Invalid data. Item transfer failed.');
        }
    }
}


module.exports = ItemService;
