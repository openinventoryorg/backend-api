const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
// const logger = require('../loaders/logger');

/**
 * Service that manages CRUD of items
 * @abstract
 * @category Services
 */
class LendService {
    /**
     * Lend item for a student
     * @param {string} id ID of Lend
     * @param {array} labId ID of a lab
     */
    static async Lend({
        userId, supervisor, title, reason, labId, items,
    }) {
        const database = await getDatabase();

        // Check if items are unique
        if (items.length !== [...new Set(items)].length) {
            throw new Errors.BadRequest('Duplicate items');
        }

        // Check if lab exists
        const lab = await database.Lab.findOne({ where: { id: labId } });
        if (!lab) {
            throw new Errors.BadRequest('Lab does not exist');
        }

        // Check if user doesnt have items taken from the same lab
        // const prev = await database.Request.findAll({ where: { userId } });
        // if (prev.length !== 0) {
        //     throw new Errors.BadRequest('You have previous pending requests');
        // }

        // Check if items exist in lab
        const itemResultsPromise = items.map((itemId) => database
            .Item.findOne({ where: { id: itemId, labId } }));
        const itemResults = await Promise.all(itemResultsPromise);
        if (itemResults.includes(null)) {
            throw new Errors.BadRequest('Some items do not exist in the system');
        }

        // Check if items are already taken

        // Check if supervisor exists

        // Create Request in REQUESTED state

        // Create RequestItems in PENDING state

        // Send email to supervisor (dont wait)

        // Send email to student (dont wair)

        return {
            userId, supervisor, title, reason, labId, items,
        };
    }
}


module.exports = LendService;
