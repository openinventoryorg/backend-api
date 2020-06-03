// test/factories/item.js
const faker = require('faker');
const { getDatabase } = require('../../src/helpers/get_database');
const { generateSecureToken } = require('../../src/helpers/secure_token');
/**
 * Generate an object which container attributes needed
 * to successfully create a request instance.
 *
 * @param  {Object} props Properties to use for the request.
 *
 * @return {Object}       An object to build the request from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        labId: faker.random.uuid(),
        userId: faker.random.uuid(),
        supervisorId: faker.random.uuid(),
        reason: faker.lorem.sentences(),
        supervisorToken: generateSecureToken(96),
        status: 'REQUESTED',
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a request instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the request.
 *
 * @return {Object}       A request instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.Request.create(await data(props));
};
