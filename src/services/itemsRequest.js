const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const config = require('../config');
const { sendMail } = require('../emails');
const { generateSecureToken } = require('../helpers/secure_token');
const { LabManager } = require('../models/schema/permissions');

/**
 * Service that manages CRUD of items request
 * @abstract
 * @category Services
 */
class ItemsRequestService {
    /**
     * Creates an items request with given data.
     * Id will be automatically generated.
     * @param {Object} itemRequest ItemRequest object to create
     * @param {array} itemRequest.itemlist List of items related to the request
     * @param {string} itemRequest.labId ID of the lab this request belongs to
     * @param {string} itemRequest.userId ID of the user this request belongs to
     * @param {string} itemRequest.supervisorId ID of the supervisor this request belongs to
     * @param {string} itemRequest.reason reason that the request is made for
     * @returns {Promise<Object>} Created item-request object
     */
    static async CreateItemsRequest({
        itemIds, labId, userId, supervisorId, reason,
    }) {
        const database = await getDatabase();
        const supervisorToken = generateSecureToken(96);

        const lab = await database.Lab.findOne({ where: { id: labId } });
        if (!lab) {
            throw new Error('Lab does not exist.');
        }

        const user = await database.User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User does not exist.');
        }

        const supervisor = await database.Supervisor.findOne({ where: { id: supervisorId } });
        if (!supervisor) {
            throw new Error('Supervisor does not exist.');
        }

        const promise = itemIds.map(async (id) => {
            const item = await database.Item.findOne({ where: { id } });
            return !!item;
        });
        const itemIdsAvailability = await Promise.all(promise);
        const itemIdError = itemIdsAvailability.includes(false);
        if (itemIdError) {
            throw new Error('A requested item does not exist');
        }

        const previousRequest = await database.Request.findOne({
            where: { userId, labId, status: 'REQUESTED' },
        });

        if (previousRequest) {
            throw new Error('A pending request for the same lab already exists.');
        }

        const request = await database.Request.build(
            {
                labId, userId, supervisorId, reason, supervisorToken, status: 'REQUESTED',
            },
        );
        let itemList;

        try {
            await database.sequelize.transaction(async (t) => {
                await request.save({ transaction: t });
                itemList = itemIds.map((itemId) => ({ itemId, requestId: request.id, status: 'PENDING' }));
                await database.RequestItem.bulkCreate(itemList, { transaction: t });
            });

            sendMail({
                from: config.mail.sender,
                to: supervisor.email,
                subject: 'Item Request Link - Open Inventory',
                template: 'supervisor_invite',
                context: {
                    firstName: supervisor.firstName,
                    lastName: supervisor.lastName,
                    labTitle: lab.title,
                    email: supervisor.email,
                    link: `${config.site.verifyToken}/${supervisorToken}`,
                },
            });
        } catch (err) {
            logger.error('Error while saving request: ', err);
            throw new Error('Invalid data. item request creation failed.');
        }
        return {
            id: request.id,
            labId: request.labId,
            userId: request.userId,
            supervisorId: request.supervisorId,
            reason: request.reason,
            itemList,
        };
    }

    /**
     * Reads an item request using the request token
     * @param {Object} {token} of the request
     * @param {string} token of the request
     * @returns {Promise<Object>}  item request object
     */
    static async GetItemsRequestByToken({ token }) {
        const database = await getDatabase();

        const itemRequest = await database.Request.findOne({
            where: { supervisorToken: token },
            include: [
                {
                    model: database.RequestItem,
                    attributes: ['itemId'],
                    include: [{
                        model: database.Item,
                        attributes: ['serialNumber'],
                        include: [
                            {
                                model: database.ItemSet,
                                attributes: ['id', 'title', 'image'],
                            },
                        ],
                    }],
                },
                {
                    model: database.Lab,
                    attributes: ['id', 'title'],
                },
                {
                    model: database.User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });

        if (!itemRequest) {
            throw new Errors.BadRequest('Invalid token!');
        }

        return itemRequest;
    }

    /**
     * Reads an item request using the request token
     * @param {Object} review
     * @param {string} token of the request
     * @param {string} value of the request
     * @param {string} declineReason of the request
     */
    static async AcceptOrDeclineRequest({ token, value, declineReason }) {
        const database = await getDatabase();

        const request = await database.Request.findOne({
            where: { supervisorToken: token },
            include: [
                {
                    model: database.User,
                    attributes: ['firstName', 'lastName', 'email'],
                },
                {
                    model: database.Lab,
                    attributes: ['id', 'title'],
                },
            ],
        });
        if (!request) {
            throw new Errors.BadRequest('Invalid token!');
        }
        if (request.status !== 'REQUESTED') {
            throw new Errors.BadRequest('Expired request!');
        }

        request.status = value ? 'ACCEPTED' : 'DECLINED';
        const status = value ? 'ACCEPTED' : 'REJECTED';

        if (!value) {
            request.declineReason = declineReason;
        }

        let items;
        try {
            await database.sequelize.transaction(async (t) => {
                await request.save({ transaction: t });
                await database.RequestItem.update(
                    { status },
                    {
                        where: { requestId: request.id },
                        transaction: t,
                    },
                );
            });

            items = (await database.RequestItem.findAll({
                where: { requestId: request.id },
                include: [{
                    model: database.Item,
                    attributes: ['serialNumber'],
                    include: [{
                        model: database.ItemSet,
                        attributes: ['title', 'image'],
                    }],
                }],
            })).map((item) => ({
                serialNumber: item.Item.serialNumber,
                title: item.Item.ItemSet.title,
            }));

            sendMail({
                from: config.mail.sender,
                to: request.User.email,
                subject: `Item Lend Request ${value ? 'Acceptance' : 'Rejection'}`,
                template: value ? 'item_request_accept' : 'item_request_reject',
                context: {
                    firstName: request.User.firstName,
                    lastName: request.User.lastName,
                    email: request.User.email,
                    labTitle: request.Lab.title,
                    declineReason,
                    items,
                },
            });
        } catch (err) {
            logger.error('Error while updating request: ', err);
            throw new Errors.BadRequest('Invalid data. item request update failed.');
        }
    }

    /**
     * Lists the item requests by a student
     * @returns {Promise<{request: Object[]}>} List of item requests
     */
    static async ListItemsRequestsByStudent({ id }) {
        const database = await getDatabase();
        const requests = await database.Request.findAll({
            where: { userId: id },
            attributes: ['id', 'supervisorId', 'status', 'updatedAt'],
            order: ['updatedAt'],
            include: [
                {
                    model: database.RequestItem,
                    attributes: ['returnedDate', 'dueDate', 'borrowedDate', 'status'],
                    include: [{
                        model: database.Item,
                        attributes: ['id', 'serialNumber'],
                        include: [
                            {
                                model: database.ItemSet,
                                attributes: ['id', 'title', 'image'],
                            },
                        ],
                    }],
                },
                {
                    model: database.Lab,
                    attributes: ['id', 'title'],
                },
            ],
        });

        return { requests };
    }

    /**
     * Lists the item requests in a lab
     * @returns {Promise<{request: Object[]}>} List of item requests
     */
    static async ListItemsRequestsByLab({ userId, userPermissions, labId }) {
        const database = await getDatabase();

        if (!userPermissions.includes(LabManager)) {
            const assignedUser = await database.LabAssign.findOne({
                where: { userId, labId },
            });
            if (!assignedUser) {
                throw new Errors.BadRequest('Insufficient permissions.');
            }
        }

        const requests = await database.Request.findAll({
            where: { labId },
            attributes: ['id', 'reason', 'status'],
            order: ['createdAt'],
            include: [
                {
                    model: database.RequestItem,
                    attributes: ['returnedDate', 'dueDate', 'borrowedDate', 'status'],
                    include: [{
                        model: database.Item,
                        attributes: ['id', 'serialNumber'],
                        include: [
                            {
                                model: database.ItemSet,
                                attributes: ['id', 'title'],
                            },
                            {
                                model: database.Lab,
                                attributes: ['title'],
                            },
                        ],
                    },
                    ],
                },
                {
                    model: database.User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
                {
                    model: database.Supervisor,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });
        return requests;
    }

    /**
     * Changes the requested item status into BORROWED in a lab
     * @returns {Promise<{request: Object[]}>} List of item requests
     */
    static async LendItem({
        itemId, requestId, userId, userPermissions,
    }) {
        const database = await getDatabase();

        const requestedItem = await database.RequestItem.findOne({
            where: { itemId, requestId, status: 'ACCEPTED' },
            include: [
                {
                    model: database.Item,
                    attributes: ['labId'],
                },
            ],
        });

        if (!requestedItem) {
            throw new Errors.BadRequest('Item Request does not exist');
        }

        if (!userPermissions.includes(LabManager)) {
            const assignedUser = await database.LabAssign.findOne({
                where: { userId, labId: requestedItem.Item.labId },
            });
            if (!assignedUser) {
                throw new Errors.BadRequest('Insufficient permissions.');
            }
        }

        const borrowedDate = new Date();

        const lendPeriod = 14;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + lendPeriod);

        requestedItem.status = 'BORROWED';
        requestedItem.borrowedDate = borrowedDate;
        requestedItem.dueDate = dueDate;

        await requestedItem.save();
        return {
            itemId: requestedItem.itemId,
            requestId: requestedItem.requestId,
            status: requestedItem.status,
        };
    }

    /**
     * Changes the requested item status into BORROWED in a lab
     * @returns {Promise<{request: Object[]}>} List of item requests
     */
    static async ReturnItem({
        itemId, requestId, userId, userPermissions,
    }) {
        const database = await getDatabase();

        const requestedItem = await database.RequestItem.findOne({
            where: { itemId, requestId, status: 'BORROWED' },
            include: [
                {
                    model: database.Item,
                    attributes: ['labId'],
                },
            ],
        });

        if (!requestedItem) {
            throw new Error('Item Request does not exist');
        }

        if (!userPermissions.includes(LabManager)) {
            const assignedUser = await database.LabAssign.findOne({
                where: { userId, labId: requestedItem.Item.labId },
            });
            if (!assignedUser) {
                throw new Error('Insufficient permissions.');
            }
        }

        const returnedDate = new Date();
        requestedItem.returnedDate = returnedDate;
        requestedItem.status = 'RETURNED';
        await requestedItem.save();

        return {
            itemId: requestedItem.itemId,
            requestId: requestedItem.requestId,
            status: requestedItem.status,
        };
    }

    /**
     * Helper function for RemindItemRequests
     * @param {Date} dueDate
     */
    static async getRequestsBasedonDueDate(dueDate) {
        const database = await getDatabase();
        const { Op } = database.Sequelize;

        const dueDateEnd = new Date(dueDate);
        dueDateEnd.setDate(dueDate.getDate() + 1);

        const requests = await database.RequestItem.findAll({
            where: {
                dueDate: {
                    [Op.and]: [
                        { [Op.lte]: dueDateEnd },
                        { [Op.gt]: dueDate },
                    ],
                    status: 'BORROWED',
                },
            },
            raw: true,
            attributes: ['borrowedDate', 'dueDate'],
            include: [
                {
                    model: database.Request,
                    attributes: [],
                    include: [
                        {
                            model: database.Lab,
                            attributes: ['title'],
                        },
                        {
                            model: database.User,
                            attributes: ['firstName', 'lastName', 'email'],
                        },
                    ],

                },
                {
                    model: database.Item,
                    attributes: ['serialNumber'],
                    include: {
                        model: database.ItemSet,
                        attributes: ['title'],
                    },
                },
            ],
        });

        return requests;
    }

    /**
     * Finds all borrowed items where the due date is close
     * @returns {Promise<{request: Object[]}>} List of item requests
     */
    static async RemindItemRequests() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        nextDate.setHours(0, 0, 0, 0);

        const thirdDate = new Date();
        thirdDate.setDate(thirdDate.getDate() + 3);
        thirdDate.setHours(0, 0, 0, 0);

        const zeroDateRequests = await ItemsRequestService.getRequestsBasedonDueDate(currentDate);
        const oneDateRequests = await ItemsRequestService.getRequestsBasedonDueDate(nextDate);
        const threeDateRequests = await ItemsRequestService.getRequestsBasedonDueDate(thirdDate);

        return { zeroDateRequests, oneDateRequests, threeDateRequests };
    }
}

module.exports = ItemsRequestService;
