module.exports = (sequelize, DataTypes) => {
    const Supervisor = sequelize.define('Supervisor', {
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
        bio: {
            type: DataTypes.TEXT,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(1023),
            unique: 'supervisor_email',
            allowNull: false,
            validate: { isEmail: true },
        },
    });

    return Supervisor;
};
