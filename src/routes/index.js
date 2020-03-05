const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');
const loginRoutes = require('./login');
const demoRoutes = require('./demo');
const { permissionMiddleware } = require('../middlewares/permission');
const permissions = require('../models/schema/permissions');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/login', loginRoutes);

    app.use('/api/registrar',
        permissionMiddleware([permissions.Administrator]),
        registrarRoutes);

    app.use('/api/demo',
        permissionMiddleware([permissions.Requester]),
        demoRoutes);
};

module.exports = { defineEndPoints };
