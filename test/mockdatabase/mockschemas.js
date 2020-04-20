const SequelizeMock = require('sequelize-mock');

const DBConnectionMock = new SequelizeMock();
const {
    ItemSetValue, LabValue, ItemValue, ItemAttributeValue, ItemAttributeValueList,
} = require('./schemavalues');

const ItemSet = DBConnectionMock.define('ItemSet', ItemSetValue);

const ItemAttribute = DBConnectionMock.define('ItemAttribute', ItemAttributeValue);

const Lab = DBConnectionMock.define('Lab', LabValue);

const Item = DBConnectionMock.define('Item', ItemValue);

// eslint-disable-next-line consistent-return
Item.$queryInterface.$useHandler(async (query, queryOptions) => {
    if (query === 'findOne') {
        const itemInstance = Item.build().dataValues;
        if (queryOptions[0].where.id !== itemInstance.id) return null;

        if (queryOptions[0].include && queryOptions[0].include.length > 0) {
            const associations = {};
            if (queryOptions[0].include.find((element) => element.model.name === 'ItemSet')) {
                associations.ItemSet = ItemSet.build().dataValues;
            } if (queryOptions[0].include.find((element) => element.model.name === 'Lab')) {
                associations.Lab = Lab.build().dataValues;
            } if (queryOptions[0].include.find((element) => element.model.name === 'ItemAttribute')) {
                associations.ItemAttributes = await ItemAttribute.bulkCreate(
                    ItemAttributeValueList,
                ).map((attribute) => attribute.dataValues);
            }
            return { ...itemInstance, ...associations };
        }
        return itemInstance;
    }
});


module.exports = {
    Item, ItemSet, ItemAttribute, Lab,
};
