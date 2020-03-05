const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');
const loginRoutes = require('./login');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/registrar', registrarRoutes);
    app.use('/api/login', loginRoutes);
};

module.exports = { defineEndPoints };
