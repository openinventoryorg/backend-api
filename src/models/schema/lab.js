module.exports = (sequelize, DataTypes) => {
    const Lab = sequelize.define('Lab', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(1023),
        },
    });

    return Lab;
};
