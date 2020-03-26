module.exports = (sequelize, DataTypes) => {
    const RequestItem = sequelize.define('RequestItem', {
        itemId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Item', key: 'id' },
        },
        requestId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Request', key: 'id' },
        },
        returnedDate: { type: DataTypes.DATE },
        dueDate: { type: DataTypes.DATE },
        borrowedDate: { type: DataTypes.DATE },
        status: {
            type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'BORROWED', 'RETURNED', 'REJECTED', 'EXPIRED'),
            defaultValue: 'PENDING',
            allowNull: false,
        },
    });

    return RequestItem;
};

// TODO: (Validation): Check nullity of dates according to states
