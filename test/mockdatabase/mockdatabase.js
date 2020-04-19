
const {
    ItemSet, Item, Lab, ItemAttribute,
} = require('./mockschemas');

const mockDatabase = () => {
    // Item.hasMany(ItemAttribute, { foreignKey: 'itemId' });
    // Item.belongsTo(Lab, { foreignKey: 'labId' });
    // Item.belongsTo(ItemSet, { foreignKey: 'itemSetId' });
    // Lab.hasMany(Item, { foreignKey: 'labId' });
    // ItemSet.hasMany(Item, { foreignKey: 'itemSetId' });


    const db = {
        ItemAttribute,
        ItemSet,
        Lab,
        Item,
    };
    return db;
};

module.exports = { mockDatabase };
