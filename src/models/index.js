const Sequelize = require('sequelize');
const logger = require('../loaders/logger');
const config = require('../config');
const Relations = require('./relations');
const UserSchema = require('./schema/user');
const RoleSchema = require('./schema/role');
const LabSchema = require('./schema/lab');
const ItemSetSchema = require('./schema/item_set');
const AttributeSchema = require('./schema/attribute');
const ItemSchema = require('./schema/item');
const ItemAttributeSchema = require('./schema/item_attribute');
const SupervisorSchema = require('./schema/supervisor');
const RequestSchema = require('./schema/request');
const RequestItemSchema = require('./schema/request_item');
const RegistrationTokenSchema = require('./schema/registration_token');
const RolePermissionSchema = require('./schema/role_permission');
const LabAssignSchema = require('./schema/lab_assign');
const PermissionsSchema = require('./schema/permissions');
const configureInitialDatabase = require('./config');


/**
 * Database initialization function
 * @returns {Promise<Models>} Database object promise
 */
async function initializeDatabase() {
    // Default global settings for database models
    const databaseOptions = {
        logging: (msg) => logger.debug(msg),
        define: {
            // Sequalizer makes database name plural by default - This is undesired
            freezeTableName: true,
        },
    };

    // Connection information
    const sequelize = new Sequelize(process.env.DATABASE_URL, databaseOptions);

    // Define database models
    const db = {
        Sequelize,
        sequelize,
        User: UserSchema(sequelize, Sequelize),
        Role: RoleSchema(sequelize, Sequelize),
        Item: ItemSchema(sequelize, Sequelize),
        Lab: LabSchema(sequelize, Sequelize),
        ItemSet: ItemSetSchema(sequelize, Sequelize),
        Attribute: AttributeSchema(sequelize, Sequelize),
        ItemAttribute: ItemAttributeSchema(sequelize, Sequelize),
        Supervisor: SupervisorSchema(sequelize, Sequelize),
        Request: RequestSchema(sequelize, Sequelize),
        RequestItem: RequestItemSchema(sequelize, Sequelize),
        RegistrationToken: RegistrationTokenSchema(sequelize, Sequelize),
        RolePermission: RolePermissionSchema(sequelize, Sequelize),
        LabAssign: LabAssignSchema(sequelize, Sequelize),
        Permission: PermissionsSchema,
    };

    // Register relations
    Relations(db);

    try {
        // Connect to database
        await sequelize.authenticate();
        if (config.initializeDatabase) {
            await sequelize.sync({ force: true });
            await configureInitialDatabase(db);
        } else {
            await sequelize.sync();
        }
    } catch (err) {
        logger.error('Unable to connect to the database or create schema: ', err);
        throw err;
    }
    logger.info('Database connection has been established successfully.');

    return db;
}

module.exports = initializeDatabase();
