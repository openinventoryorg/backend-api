const registrarRoutes = require('./registrar');
const registrationRoutes = require('./registration');
const loginRoutes = require('./login');
const demoRoutes = require('./demo');
const manageLabsRoutes = require('./managelabs');
const manageRolesRoutes = require('./manageroles');
const managePermissionsRoutes = require('./managepermissions');
const manageItemsRoutes = require('./manageitems');
const manageItemsetsRoutes = require('./manageitemsets');
const manageUsersRoutes = require('./manageusers');
const manageSupervisorsRoutes = require('./managesupervisors');
const lendRoutes = require('./lend');

const defineEndPoints = (app) => {
    app.use('/api/registration', registrationRoutes);
    app.use('/api/login', loginRoutes);
    app.use('/api/registrar', registrarRoutes);
    app.use('/api/labs', manageLabsRoutes);
    app.use('/api/roles', manageRolesRoutes);
    app.use('/api/permissions', managePermissionsRoutes);
    app.use('/api/itemsets', manageItemsetsRoutes);
    app.use('/api/items', manageItemsRoutes);
    app.use('/api/users', manageUsersRoutes);
    app.use('/api/demo', demoRoutes);
    app.use('/api/lend', lendRoutes);
    app.use('/api/supervisors', manageSupervisorsRoutes);
};

module.exports = { defineEndPoints };
