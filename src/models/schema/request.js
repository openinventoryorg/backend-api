module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'User', key: 'id' },
        },
        supervisorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Supervisor', key: 'id' },
        },
        reason: { type: DataTypes.TEXT },
        declineReason: {
            type: DataTypes.TEXT,
            Validation: {
                declineReasonValidation(status) {
                    const nNullList = ['DECLINED', 'INVALIDATED'];
                    const nullList = ['REQUESTED', 'ACCEPTED'];

                    nNullList.forEach((item) => {
                        if (status.type === item && this.declineReason === null) throw new Error('Decline Reason Validation Error!');
                    });

                    nullList.forEach((item) => {
                        if (status.type === item && this.returnedDate !== null) throw new Error('Decline Reason Validation Error!');
                    });
                },
            },
        },
        supervisorToken: {
            type: DataTypes.UUID,
            unique: 'supervisor_token',
            Validation: {
                supervisorTokenValidation(status) {
                    const nNullList = ['REQUESTED', 'ACCEPTED'];
                    const nullList = ['DECLINED', 'INVALIDATED'];

                    nNullList.forEach((item) => {
                        if (status.type === item && this.supervisorToken === null) throw new Error('Supervisor Token Validation Error!');
                    });

                    nullList.forEach((item) => {
                        if (status.type === item && this.supervisorToken !== null) throw new Error('Supervisor Token Validation Error!');
                    });
                },
            },
        },
        status: {
            type: DataTypes.ENUM('REQUESTED', 'ACCEPTED', 'DECLINED', 'INVALIDATED'),
            defaultValue: 'REQUESTED',
            allowNull: false,
        },
    });

    return Request;
};

// TODO: (Validation): Check null states of declineReason and supervisorToken according to states
