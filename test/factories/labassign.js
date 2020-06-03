// test/factories/labassign.js

const { getDatabase } = require('../../src/helpers/get_database');

/**
 * Generates a labassign instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the labassign.
 *
 * @return {Object}       A labassign instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    await database.LabAssign.create(props);
};
