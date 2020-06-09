const AdminBroExpress = require('admin-bro-expressjs');
const AdminBro = require('admin-bro');
const LoginService = require('./services/login');
const config = require('./config');

const userContent = { name: 'User Resources', icon: 'User' };
const itemContent = { name: 'Item Resources', icon: 'Catalog' };
const requestContent = { name: 'Request Resources', icon: 'ArrowsHorizontal' };
const labContent = { name: 'Lab Resources', icon: 'Screen' };

const adminDashboard = (database) => {
    // Admin dashboard configuration
    const adminBro = new AdminBro({
        resources: [
            { resource: database.User, options: { parent: userContent } },
            { resource: database.Role, options: { parent: userContent } },
            { resource: database.Item, options: { parent: itemContent } },
            { resource: database.Lab, options: { parent: labContent } },
            { resource: database.ItemSet, options: { parent: itemContent } },
            { resource: database.Attribute, options: { parent: itemContent } },
            { resource: database.ItemAttribute, options: { parent: itemContent } },
            { resource: database.Supervisor, options: { parent: userContent } },
            { resource: database.Request, options: { parent: requestContent } },
            { resource: database.RequestItem, options: { parent: requestContent } },
            { resource: database.RegistrationToken, options: { parent: userContent } },
            { resource: database.RolePermission, options: { parent: userContent } },
            { resource: database.LabAssign, options: { parent: labContent } },
            { resource: database.TemporaryRequest, options: { parent: requestContent } },
        ],
        dashboard: {
            component: AdminBro.bundle('./dashboard'),
        },
        rootPath: '/admin',
        branding: {
            companyName: 'Open Inventory System',
            logo: false,
            softwareBrothers: false,
            theme: {
                colors:
                {
                    primary100: '#1C2D48',
                    primary80: '#1C2D48',
                    primary60: '#5BC9A6',
                    primary40: '#5BC9A6',
                    primary20: '#B1E1C3',
                    accent: '#D81E5B',
                    filterBg: '#256769',
                },
            },
        },
        locale: {
            language: 'en',
            translations: {
                messages: {
                    loginWelcome: 'To the super-administrative dashboard '
                        + '[Administrators only]. '
                        + 'You wont be able to undo any changes in this mode. ',
                },
            },
        },
    });

    // Build and use a router which will handle all AdminBro routes
    const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
        authenticate: async (email, password) => {
            try {
                const { user } = await LoginService.Login(email, password);
                if (!user) return false;
                if (!user.permissions) return false;
                return user.permissions.find((v) => v === 'ADMINISTRATOR');
            } catch (err) {
                return false;
            }
        },
        cookiePassword: config.jwtSecret,
    }, undefined, { resave: true, saveUninitialized: false });

    return { adminRouter, adminBro };
};

module.exports = { adminDashboard };
