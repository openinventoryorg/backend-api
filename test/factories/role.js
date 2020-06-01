// test/factories/itemset.js
const faker = require('faker');

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a role instance.
 *
 * @param  {Object} props Properties to use for the role.
 *
 * @return {Object}       An object to build the role from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        name: faker.name.jobTitle(),
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a role instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the role.
 *
 * @return {Object}       A role instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.Role.create(await data(props));
};
