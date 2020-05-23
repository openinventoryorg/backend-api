const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');

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
     * * @param {string} itemRequest.userId ID of the student this request belongs to
     * @param {string} itemRequest.state state of the request(BORROWED/RETURNED)
     * @returns {Promise<Object>} Created temporary_request object
     */
    static async ManageTemporaryRequest({ itemId, userId, state }) {
        const database = await getDatabase();
    }
}

module.exports = TemporaryRequestsService;
