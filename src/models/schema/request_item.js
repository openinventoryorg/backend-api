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
            Validation:{ 
                returnedDateValidation: function(status) {
                    let nNullList = ['PENDING', 'BORROWED', 'REJECTED']
                    let nullList = ['RETURNED','EXPIRED' ]
                    nNullList.forEach(function(item, index, array) {
                        if(status.type === item && returnedDate !== null) throw new Error("Returned Date Validation Error!")
                      })

                    nullList.forEach(function(item, index, array) {
                        if(status.type === item && returnedDate === null) throw new Error("Returned Date Validation Error!")
                      })
                      
                }
            }
         },
        dueDate: { 
            type: DataTypes.DATE, 
            Validation:{ 
                dueDateValidation: function(status) {

                    let nNullList = ['PENDING', 'REJECTED']
                    let nullList = ['RETURNED','BORROWED','EXPIRED' ]
                    nNullList.forEach(function(item, index, array) {
                        if(status.type === item && dueDate !== null) throw new Error("Due Date Validation Error!")
                      })

                    nullList.forEach(function(item, index, array) {
                        if(status.type === item && dueDate === null) throw new Error("Due Date Validation Error!")
                      })
                      
                }
            }
        },
        borrowedDate: { 
            type: DataTypes.DATE,
            Validation:{ 
                borrowedDateValidation: function(status) {
                    
                    let nNullList = ['PENDING', 'REJECTED']
                    let nullList = ['RETURNED','BORROWED','EXPIRED' ]
                    nNullList.forEach(function(item, index, array) {
                        if(status.type === item && borrowedDate !== null) throw new Error("Borrowed Date Validation Error!")
                      })

                    nullList.forEach(function(item, index, array) {
                        if(status.type === item && borrowedDate === null) throw new Error("Borrowed Date Validation Error!")
                      })
                    
                }
            }
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
