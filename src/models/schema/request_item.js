module.exports = (sequelize, DataTypes) => {
    const RequestItem = sequelize.define('RequestItem', {
        itemId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Item', key: 'id' },
        },
        requestId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: { model: 'Request', key: 'id' },
        },
        returnedDate: {
            type: DataTypes.DATE,
            Validation: {
                returnedDateValidation(status) {
                    const nNullList = ['PENDING', 'BORROWED', 'REJECTED'];
                    const nullList = ['RETURNED', 'EXPIRED'];
                    nNullList.forEach((item) => {
                        if (status.type === item && this.returnedDate !== null) throw new Error('Returned Date Validation Error!');
                    });

                    nullList.forEach((item) => {
                        if (status.type === item && this.returnedDate === null) throw new Error('Returned Date Validation Error!');
                    });
                },
            },
        },
        dueDate: {
            type: DataTypes.DATE,
            Validation: {
                dueDateValidation(status) {
                    const nNullList = ['PENDING', 'REJECTED'];
                    const nullList = ['RETURNED', 'BORROWED', 'EXPIRED'];
                    nNullList.forEach((item) => {
                        if (status.type === item && this.dueDate !== null) throw new Error('Due Date Validation Error!');
                    });

                    nullList.forEach((item) => {
                        if (status.type === item && this.dueDate === null) throw new Error('Due Date Validation Error!');
                    });
                },
            },
        },
        borrowedDate: {
            type: DataTypes.DATE,
            Validation: {
                borrowedDateValidation(status) {
                    const nNullList = ['PENDING', 'REJECTED'];
                    const nullList = ['RETURNED', 'BORROWED', 'EXPIRED'];
                    nNullList.forEach((item) => {
                        if (status.type === item && this.borrowedDate !== null) throw new Error('Borrowed Date Validation Error!');
                    });

                    nullList.forEach((item) => {
                        if (status.type === item && this.borrowedDate === null) throw new Error('Borrowed Date Validation Error!');
                    });
                },
            },
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'BORROWED', 'RETURNED', 'REJECTED', 'EXPIRED'),
            defaultValue: 'PENDING',
            allowNull: false,
        },
    });

    return RequestItem;
};

// TODO: (Validation): Check nullity of dates according to states
