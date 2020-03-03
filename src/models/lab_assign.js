module.exports = (sequelize, DataTypes) => {
    const LabAssign = sequelize.define('LabAssign', {
        labId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Lab', key: 'id' },
        },
        userId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'User', key: 'id' },
        },
    });

    return LabAssign;
};
