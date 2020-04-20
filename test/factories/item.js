// test/factories/item.js
const faker = require('faker');

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        serialNumber: faker.commerce.product(),
        labId: faker.random.uuid(),
        itemSetId: faker.random.uuid(),
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
export default async (props = {}) => {
    const database = await getDatabase();
    return database.Item.create(await data(props));
};
