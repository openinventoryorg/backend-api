module.exports = (sequelize, DataTypes) => {
    const ItemAttribute = sequelize.define('ItemAttribute', {
        itemId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Item', key: 'id' },
        },
        key: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    return ItemAttribute;
};
