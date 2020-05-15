const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const config = require('../config');
const { sendMail } = require('../emails');
const { generateSecureToken } = require('../helpers/secure_token');


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
            throw new Errors.BadRequest('Lab does not exist.');
        }

        const user = await database.User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Errors.BadRequest('User does not exist.');
        }

        const supervisor = await database.Supervisor.findOne({ where: { id: supervisorId } });
        if (!supervisor) {
            throw new Errors.BadRequest('Supervisor does not exist.');
        }

        const itemIdError = itemIds.every(async (id) => {
            const item = await database.User.findOne({ where: { id } });
            return (item != null);
        });
        if (!itemIdError) {
            throw new Errors.BadRequest('A requested item does not exist');
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
            throw new Errors.BadRequest('Invalid data. item request creation failed.');
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
                        attributes: ['title'],
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
}

module.exports = ItemsRequestService;
