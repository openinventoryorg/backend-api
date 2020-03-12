const database = require('../models');
const logger = require('../loaders/logger');
const Errors = require('./errors');

/**
 * Gets the database from models.
 *
 * The database will be returned as a Promise.
 * Throws 500 error if database connection failed.
 * @returns {Promise<any>} database object with models
 */
const getDatabase = async () => {
    try {
        return await database;
    } catch (err) {
        logger.error('Database connection issue: ', err);
        throw new Errors.InternalServerError('Database connection issue');
    }
};

module.exports = { getDatabase };
