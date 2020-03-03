module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
        roleId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Role', key: 'id' },
        },
        permissionId: {
            type: DataTypes.STRING(31),
            primaryKey: true,
            references: { model: 'Permission', key: 'id' },
        },
    });

    return RolePermission;
};
