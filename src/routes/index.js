const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/registrar', registrarRoutes);
};

module.exports = { defineEndPoints };
