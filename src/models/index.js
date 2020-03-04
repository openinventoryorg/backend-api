const Sequelize = require('sequelize');
const logger = require('../loaders/logger');
const UserSchema = require('./user');
const RoleSchema = require('./role');
const LabSchema = require('./lab');
const ItemSetSchema = require('./item_set');
const AttributeSchema = require('./attribute');
const ItemSchema = require('./item');
const ItemAttributeSchema = require('./item_attribute');
const SupervisorSchema = require('./supervisor');
const RequestSchema = require('./request');
const RequestItemSchema = require('./request_item');
const RegistrationTokenSchema = require('./registration_token');
const RolePermissionSchema = require('./role_permission');
const LabAssignSchema = require('./lab_assign');

async function initialize() {
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
        Lab: LabSchema(sequelize, Sequelize),
        ItemSet: ItemSetSchema(sequelize, Sequelize),
        Attribute: AttributeSchema(sequelize, Sequelize),
        Item: ItemSchema(sequelize, Sequelize),
        ItemAttribute: ItemAttributeSchema(sequelize, Sequelize),
        Supervisor: SupervisorSchema(sequelize, Sequelize),
        Request: RequestSchema(sequelize, Sequelize),
        RequestItem: RequestItemSchema(sequelize, Sequelize),
        RegistrationToken: RegistrationTokenSchema(sequelize, Sequelize),
        RolePermission: RolePermissionSchema(sequelize, Sequelize),
        LabAssign: LabAssignSchema(sequelize, Sequelize),
    };

    try {
        // Connect to database
        await sequelize.authenticate();
        // Sync database schema - Set force: true to drop all tables and recreate
        await sequelize.sync({ force: false });
    } catch (err) {
        logger.error('Unable to connect to the database or create schema: ', err);
        throw err;
    }
    logger.info('Database connection has been established successfully.');

    return db;
}

module.exports = initialize();
