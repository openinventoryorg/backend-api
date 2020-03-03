module.exports = (sequelize, DataTypes) => {
    const ItemSet = sequelize.define('ItemSet', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1023),
            validate: { isUrl: true },
        },
    });

    return ItemSet;
};
