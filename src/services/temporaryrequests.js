const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const { LabManager } = require('../models/schema/permissions');

/**
 * Service that manages CRUD of items request
 * @abstract
 * @category Services
 */
class TemporaryRequestsService {
    /**
     * Creates an items request with given data.
     * Id will be automatically generated.
     * @param {Object} temporaryRequest ItemRequest object to create
     * @param {string} itemRequest.itemId ID of the item this request belongs to
     * @param {string} itemRequest.studentId ID of the student this request belongs to
     * @param {string} itemRequest.userId ID userId of the HTTP request maker
     * @param {string} itemRequest.userPermissions permissions of the HTTP request maker
     * @returns {Promise<Object>} Created temporary_request object
     */
    static async CreateTemporaryRequest({
        serialNumber, studentId, userId, userPermissions,
    }) {
        const database = await getDatabase();

        const item = await database.Item.findOne({
            where: { serialNumber },
            attributes: ['id', 'labId'],
        });

        if (!item) {
            throw new Errors.BadRequest('Requested Item does not exist');
        }

        if (!userPermissions.includes(LabManager)) {
            const assignedUser = await database.LabAssign.findOne({
                where: { userId, labId: item.labId },
            });
            if (!assignedUser) {
                throw new Errors.Unauthorized('Insufficient permissions');
            }
        }

        const notReturnedItems = !!(await database.TemporaryRequest.findOne({
            where: { studentId, status: 'BORROWED' },
        }));

        if (notReturnedItems) {
            throw new Errors.BadRequest('Requester has items to be returned to the lab.');
        }

        const itemUnavailable = !!(await database.RequestItem.findOne({
            where: { itemId: item.id, status: 'BORROWED' },
        })) || !!(await database.TemporaryRequest.findOne({
            where: { itemId: item.id, status: 'BORROWED' },
        }));

        if (itemUnavailable) {
            throw new Errors.BadRequest('Item is not available in the lab.');
        }

        const borrowedTime = new Date();
        const dueTime = new Date(new Date().setHours(24, 0, 0, 0));

        let temporaryRequest;
        try {
            temporaryRequest = database.TemporaryRequest.create({
                itemId: item.id, borrowedTime, dueTime, studentId, status: 'BORROWED',
            });
        } catch (err) {
            logger.error('Error while saving request: ', err);
            throw new Errors.BadRequest('Invalid data. item request creation failed.');
        }

        return temporaryRequest;
    }

    /**
     * Updates the status of a temporary request to RETURNED.
     * Id will be automatically generated.
     * @param {Object} temporaryRequest ItemRequest object to create
     * @param {string} itemRequest.itemId ID of the item this request belongs to
     * @param {string} itemRequest.studentId ID of the student this request belongs to
     * @param {string} itemRequest.userId ID userId of the HTTP request maker
     * @param {string} itemRequest.userPermissions permissions of the HTTP request maker
     * @returns {Promise<Object>} Created temporary_request object
     */
    static async UpdateTemporaryRequest({
        serialNumber, studentId, userId, userPermissions,
    }) {
        const database = await getDatabase();

        const item = await database.Item.findOne({
            where: { serialNumber },
            attributes: ['id', 'labId'],
        });

        if (!item) {
            throw new Errors.BadRequest('Requested Item does not exist');
        }

        const temporaryRequest = await database.TemporaryRequest.findOne({
            where: { itemId: item.id, studentId, status: 'BORROWED' },
        });

        if (!temporaryRequest) {
            throw new Errors.BadRequest('Temporary Item request does not exist');
        }

        if (!userPermissions.includes(LabManager)) {
            const assignedUser = await database.LabAssign.findOne({
                where: { userId, labId: item.labId },
            });
            if (!assignedUser) {
                throw new Errors.Unauthorized('Insufficient permissions');
            }
        }

        temporaryRequest.status = 'RETURNED';
        temporaryRequest.returnedTime = new Date();
        await temporaryRequest.save();

        return temporaryRequest;
    }
}

module.exports = TemporaryRequestsService;
