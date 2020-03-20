/**
 * Defines relationships between database models.
 *
 * @param {Models} database Database object
 */
module.exports = (database) => {
    database.Role.hasMany(database.RegistrationToken, { foreignKey: 'assignedRoleId' });
    database.RegistrationToken.belongsTo(database.Role, { foreignKey: 'assignedRoleId' });
    database.Role.hasMany(database.User, { foreignKey: 'roleId' });
    database.User.belongsTo(database.Role, { foreignKey: 'roleId' });
    database.Role.hasMany(database.RolePermission, { foreignKey: 'roleId' });
    database.User.hasMany(database.LabAssign, { foreignKey: 'userId' });
    database.Lab.hasMany(database.LabAssign, { foreignKey: 'labId' });
};
