const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');
const loginRoutes = require('./login');
const demoRoutes = require('./demo');
const manageLabsRoutes = require('./managelabs');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/registrar', registrarRoutes);
    app.use('/api/labs', manageLabsRoutes);

    app.use('/api/demo', demoRoutes);
};

module.exports = { defineEndPoints };
