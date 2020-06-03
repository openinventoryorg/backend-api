// test/factories/itemset.js
const faker = require('faker');

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a temporaryrequest instance.
 *
 * @param  {Object} props Properties to use for the temporaryrequest.
 *
 * @return {Object}       An object to build the temporaryrequest from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        itemId: faker.random.uuid(),
        studentId: faker.random.alphaNumeric(10),
        userId: faker.random.uuid(),
        userPermissions: ['LAB_MANAGER', 'ADMINISTRATOR'],
        status: 'BORROWED',
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a temporaryrequest instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the temporaryrequest.
 *
 * @return {Object}       A temporaryrequest instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.TemporaryRequest.create(await data(props));
};
