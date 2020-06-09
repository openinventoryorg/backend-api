const AdminBroExpress = require('admin-bro-expressjs');
const AdminBro = require('admin-bro');
const LoginService = require('./services/login');
const config = require('./config');

const adminDashboard = (database) => {
    // Admin dashboard configuration
    const adminBro = new AdminBro({
        databases: [database.sequelize],
        rootPath: '/admin',
        branding: {
            companyName: 'Open Inventory System',
            logo: false,
            softwareBrothers: false,
            theme: {
                colors:
                {
                    primary100: '#23395B',
                    primary80: '#23395B',
                    primary60: '#5BC9A6',
                    primary40: '#5BC9A6',
                    primary20: '#B1E1C3',
                    accent: '#D81E5B',
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
                return await LoginService.Login(email, password);
            } catch (err) {
                return false;
            }
        },
        cookiePassword: config.jwtSecret,
    }, undefined, { resave: true, saveUninitialized: false });

    return { adminRouter, adminBro };
};

module.exports = { adminDashboard };
