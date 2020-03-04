module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false,

        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(1023),
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(1023),
            unique: 'email',
            allowNull: false,
            validate: { isEmail: true },
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Role', key: 'id' },
        },
    });

    return User;
};
