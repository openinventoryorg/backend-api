const dotenv = require('dotenv');

// Define node environment type: development(default) or production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Throw an error if loading the config file failed
const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

/**
 * Configurations object related with this server.
 * Most of these settings are loaded from .env file
 */
const configurations = {
    env: process.env.NODE_ENV, // Environment type
    port: parseInt(process.env.PORT, 10) || 8000, // Port number
    databaseURL: process.env.DATABASE_URL, // Database connection string
    jwtSecret: process.env.JWT_SECRET, // JWT secret key to use in encryption
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10), // Complexity of salt
    logs: {
        level: process.env.LOG_LEVEL || 'silly', // The error logging level
    },
    mail: {
        // Automated email sender name
        sender: process.env.MAIL_SENDER || 'noreply@openinventory.org',
        etherealUsername: process.env.ETHEREAL_USERNAME || 'username',
        etherealPassword: process.env.ETHEREAL_PASSWORD || 'password',
        gmailUsername: process.env.GMAIL_USERNAME || '',
        gmailPassword: process.env.GMAIL_PASSWORD || '',
    },
    site: {
        // Token verification url: [verifyToken]/TOKEN
        verifyToken: process.env.SITE_API || 'https://openinventory.org/register',
    },
    initializeDatabase: (process.env.DB_INIT === 'true') || false,
    adminEmail: process.env.ADMIN_EMAIL || 'admin@admin.com',
};

module.exports = configurations;
