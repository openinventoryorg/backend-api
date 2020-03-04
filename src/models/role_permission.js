const { permissions } = require('./permissions');

module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
        roleId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Role', key: 'id' },
        },
        permissionId: {
            type: DataTypes.ENUM(permissions),
            primaryKey: true,
        },
    });

    return RolePermission;
};
