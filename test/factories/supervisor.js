// test/factories/itemset.js
const faker = require('faker');

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a supervisor instance.
 *
 * @param  {Object} props Properties to use for the supervisor.
 *
 * @return {Object}       An object to build the supervisor from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        bio: faker.lorem.sentence(),
        email: faker.internet.email(),
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a supervisor instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the supervisor.
 *
 * @return {Object}       A supervisor instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.Supervisor.create(await data(props));
};
