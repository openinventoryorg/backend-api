const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
// const config = require('../config');
// const { sendMail } = require('../emails');


/**
 * Service that manages CRUD of items request
 * @abstract
 * @category Services
 */
class ItemsRequestService {
    /**
     * Creates an items request with given data.
     * Id will be automatically generated.
     * @param {Object} item Item object to create
     * @param {string} item.serialNumber serial number of item, must be unique
     * @param {string} item.itemSetId ID of the item set this belongs to
     * @param {string} item.labId ID of the lab this belongs to
     * @param {array} item.attributes Attributes for the item
     * @returns {Promise<Object>} Created item object
     */
    static async createItemsRequest({
        itemIds, labId, userId, supervisorId, reason,
    }) {
        const database = await getDatabase();

        const lab = await database.Lab.findOne({ where: { id: labId } });
        if (!lab) {
            throw new Errors.BadRequest('Lab does not exist.');
        }

        const user = await database.User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Errors.BadRequest('User does not exist.');
        }

        // const supervisor = await database.Supervisor.findOne({ where: { id: supervisorId } });
        // if (!supervisor) {
        //     throw new Errors.BadRequest('Supervisor does not exist.');
        // }

        const itemIdError = itemIds.every(async (id) => {
            const item = await database.User.findOne({ where: { id } });
            return (item != null);
        });
        if (!itemIdError) {
            console.log('hi');
            throw new Errors.BadRequest('A requested item does not exist');
        }

        const request = await database.Request.build(
            {
                userId, supervisorId, reason, status: 'REQUESTED',
            },
        );
        let itemList;
        try {
            await database.sequelize.transaction(async (t) => {
                await request.save({ transaction: t });
                itemList = itemIds.map((itemId) => ({ itemId, requestId: request.id, status: 'PENDING' }));
                await database.RequestItem.bulkCreate(itemList, { transaction: t });
            });

            // sendMail({
            //     from: config.mail.sender,
            //     to: email,
            //     subject: 'Registration Link - Open Inventory',
            //     template: 'registration_invite',
            //     context: {
            //         email,
            //         link: `${config.site.verifyToken}/${token}`,
            //     },
            // });

            // // Log the token for now
            // logger.info(`Token generated for ${email} on role ${roleId} - ${token}`);
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
}

module.exports = ItemsRequestService;
