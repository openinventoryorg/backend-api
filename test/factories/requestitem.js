// test/factories/item.js
const faker = require('faker');
const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a request item instance.
 *
 * @param  {Object} props Properties to use for the request item.
 *
 * @return {Object}       An object to build the request item from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        itemId: faker.random.uuid(),
        requestId: faker.random.uuid(),
        status: 'PENDING',
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a request item instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the request item.
 *
 * @return {Object}       A request item instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.RequestItem.create(await data(props));
};
