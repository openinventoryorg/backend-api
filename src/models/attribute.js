module.exports = (sequelize, DataTypes) => {
    const Attribute = sequelize.define('Attribute', {
        itemSetId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'ItemSet', key: 'id' },
        },
        key: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        // This must be provided if editable is false
        defaultValue: { type: DataTypes.TEXT },
        editable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    });

    return Attribute;
};

// TODO: (Validation): defaultValue can be null iff editable is true
