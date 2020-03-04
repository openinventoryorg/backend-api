const registrarRoutes = require('./routes/registrar');
const registrationRoutes = require('./routes/registration');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/registrar', registrarRoutes);
};

module.exports = { defineEndPoints };
