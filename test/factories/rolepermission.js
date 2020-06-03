// test/factories/itemset.js
const faker = require('faker');

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a role permission instance.
 *
 * @param  {Object} props Properties to use for the role permission.
 *
 * @return {Object}       An object to build the role permission from.
 */
const data = async (props = {}) => {
    const defaultProps = {
        roleId: faker.random.uuid(),
        permissionId: 'ADMINISTRATOR',
    };
    return { ...defaultProps, ...props };
};
/**
 * Generates a role permission instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the role permission.
 *
 * @return {Object}       A role permission instance
 */
module.exports = async (props = {}) => {
    const database = await getDatabase();
    return database.RolePermission.create(await data(props));
};
