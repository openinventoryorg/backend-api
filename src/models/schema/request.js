module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'User', key: 'id' },
        },
        supervisorId: {
            type: DataTypes.UUID,
            allowNull: false,
            // references: { model: 'Supervisor', key: 'id' },
        },
        reason: { type: DataTypes.TEXT },
        declineReason: { type: DataTypes.TEXT },
        supervisorToken: {
            type: DataTypes.UUID,
            unique: 'supervisor_token',
        },
        status: {
            type: DataTypes.ENUM('REQUESTED', 'ACCEPTED', 'DECLINED', 'INVALIDATED'),
            defaultValue: 'REQUESTED',
            allowNull: false,
        },
    });

    return Request;
};

// TODO: (Validation): Check null states of declineReason and supervisorToken according to states
