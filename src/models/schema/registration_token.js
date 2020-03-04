module.exports = (sequelize, DataTypes) => {
    const RegistrationToken = sequelize.define('RegistrationToken', {
        email: {
            type: DataTypes.STRING(1023),
            allowNull: false,
            primaryKey: true,
            validate: { isEmail: true },
        },
        assignedRoleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Role', key: 'id' },
        },
        token: {
            type: DataTypes.CHAR(96),
            allowNull: false,
            unique: 'registration_token',
        },
        valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    });

    return RegistrationToken;
};
