module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        serialNumber: {
            type: DataTypes.STRING(255),
            unique: 'serial_number',
            allowNull: false,
        },
        labId: {
            type: DataTypes.UUID,
            references: { model: 'Lab', key: 'id' },
        },
        itemSetId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'ItemSet', key: 'id' },
        },
    });

    return Item;
};
