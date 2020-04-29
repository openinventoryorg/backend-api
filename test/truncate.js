const { getDatabase } = require('../src/helpers/get_database');

module.exports = async function truncate() {
    const database = await getDatabase();
    return database.sequelize.sync({ force: true });
};
