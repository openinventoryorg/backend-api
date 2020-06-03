const { sendMail } = require('../emails');
const config = require('../config');
const ItemsRequestService = require('../services/itemsRequest');
const logger = require('../loaders/logger');
const Errors = require('../helpers/errors');

const convertDateToString = (date) => `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

const sendRemindMail = (context) => {
    sendMail({
        from: config.mail.sender,
        to: context.email,
        subject: 'Reminder on Item Return Deadline - Open Inventory',
        template: 'item_return_student_reminder',
        context,
    });
};

const sendMailCollection = (collection, type) => {
    collection.forEach((request) => {
        try {
            const context = {
                firstName: request['Request.User.firstName'],
                lastName: request['Request.User.lastName'],
                email: request['Request.User.email'],
                labTitle: request['Request.Lab.title'],
                serialNumber: request['Item.serialNumber'],
                itemsetTitle: request['Item.ItemSet.title'],
                borrowedDate: convertDateToString(request.borrowedDate),
                dueDate: convertDateToString(request.dueDate),
                zeroDays: type.ZERO,
                oneDay: type.ONE,
                threeDays: type.THREE,
            };
            sendRemindMail(context);
        } catch (err) {
            logger.error('Error during email sending. ', err);
            throw new Errors.InternalServerError('Invalid data. item request creation failed.');
        }
    });
};

const remindItemRequestDeadline = async () => {
    const {
        zeroDateRequests, oneDateRequests, threeDateRequests,
    } = await ItemsRequestService.RemindItemRequests();

    sendMailCollection(zeroDateRequests, { ZERO: true, ONE: false, THREE: false });
    sendMailCollection(oneDateRequests, { ZERO: false, ONE: true, THREE: false });
    sendMailCollection(threeDateRequests, { ZERO: false, ONE: false, THREE: true });
};


module.exports = { remindItemRequestDeadline };
