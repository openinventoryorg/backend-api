const database = require('../models');
const logger = require('../loaders/logger');
const Errors = require('./errors');


const getDatabase = async () => {
    try {
        return await database;
    } catch (err) {
        logger.error('Database connection issue: ', err);
        throw new Errors.InternalServerError('Database connection issue');
    }
};

module.exports = { getDatabase };
