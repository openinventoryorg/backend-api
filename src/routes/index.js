const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');
const loginRoutes = require('./login');
const demoRoutes = require('./demo');
const manageLabsRoutes = require('./managelabs');
const manageRolesRoutes = require('./manageroles');
const managePermissionsRoutes = require('./managepermissions');
const manageItemsetsRoutes = require('./manageitemsets.js');
const manageUsersRoutes = require('./manageusers');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/registrar', registrarRoutes);
    app.use('/api/labs', manageLabsRoutes);
    app.use('/api/roles', manageRolesRoutes);
    app.use('/api/permissions', managePermissionsRoutes);
    app.use('/api/itemsets', manageItemsetsRoutes);
    app.use('/api/users', manageUsersRoutes);
    app.use('/api/demo', demoRoutes);
};

module.exports = { defineEndPoints };
