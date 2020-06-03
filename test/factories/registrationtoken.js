// test/factories/item.js
const faker = require('faker');
const { getDatabase } = require('../../src/helpers/get_database');
const { generateSecureToken } = require('../../src/helpers/secure_token');
/**
 * Generate an object which container attributes needed
 * to successfully create a registrationtoken instance.
 *
 * @param  {Object} props Properties to use for the registrationtoken.
 *
 * @return {Object}       An object to build the registrationtoken from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        email: faker.internet.email(),
        assignedRoleId: faker.random.uuid(),
        token: faker.random.alphaNumeric(96),
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a registrationtoken instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the registrationtoken.
 *
 * @return {Object}       A registrationtoken instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.RegistrationToken.create(await data(props));
};
