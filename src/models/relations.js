module.exports = (database) => {
    database.Role.hasMany(database.RegistrationToken, { foreignKey: 'assignedRoleId' });
    database.RegistrationToken.belongsTo(database.Role, { foreignKey: 'assignedRoleId' });
};
