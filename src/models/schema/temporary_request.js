module.exports = (sequelize, DataTypes) => {
    const TemporaryRequest = sequelize.define('RequestItem', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        itemId: {
            type: DataTypes.UUID,
            references: { model: 'Item', key: 'id' },
        },
        returnedTime: { type: DataTypes.DATE },
        dueTime: { type: DataTypes.DATE },
        borrowedTime: { type: DataTypes.DATE },
        status: {
            type: DataTypes.ENUM('BORROWED', 'RETURNED'),
            defaultValue: 'BORROWED',
            allowNull: false,
        },
    });

    return TemporaryRequest;
};

// TODO: (Validation): Check nullity of dates according to states
