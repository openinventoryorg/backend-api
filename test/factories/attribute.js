// test/factories/attribute.js

const { getDatabase } = require('../../src/helpers/get_database');
/**
 * Generate an object which container attributes needed
 * to successfully create a attribute instances.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       An object to build the user from.
 */
const attributes = [
    {
        key: 'price',
        defaultValue: '500',
        editable: true,
    },
    {
        key: 'temperature',
        defaultValue: '100C',
        editable: false,
    },
];
const data = (itemSetId) => attributes.map((attribute) => ({ itemSetId, ...attribute }));
/**
 * Generates a user instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the user.
 *
 * @return {Object}       A user instance
 */
module.exports = async (props = []) => {
    const database = await getDatabase();
    return database.Attribute.bulkCreate(await data(props));
};
