module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        serialNumber: {
            type: DataTypes.STRING(255),
            unique: 'serial_number',
            allowNull: false,
        },
        // Lab id can be null iff isDraft is true
        isDraft: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        labId: {
            type: DataTypes.UUID,
            references: { model: 'Lab', key: 'id' },
            Validation: {
                labIdValidation(isDraft) {
                    if (isDraft === false && this.labId !== null) throw new Error('LabId validation failed');
                },
            },
        },
        itemSetId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'ItemSet', key: 'id' },
        },
    });

    return Item;
};

// TODO: (Validation): Lab id can be null iff isDraft is true
