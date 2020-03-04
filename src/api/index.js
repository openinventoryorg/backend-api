const registrarRoutes = require('./routes/registrar');
const listRoutes = require('./routes/list');

const defineEndPoints = (app) => {
    app.use('/api/registrar', registrarRoutes);
    app.use('/api/list', listRoutes);
};

module.exports = { defineEndPoints };
