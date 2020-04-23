// const { getDatabase } = require('../helpers/get_database');
// const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

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
    static async Lend({ id, ...values }) {
        // const database = await getDatabase();
        logger.info({ values, id });
        return { values, id };
    }
}


module.exports = LendService;
