const registrarRoutes = require('./routes/registrar');

const defineEndPoints = (app) => {
    app.use('/api/registrar', registrarRoutes);
};

module.exports = { defineEndPoints };
