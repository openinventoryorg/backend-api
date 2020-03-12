const dotenv = require('dotenv');

// Define node environment type: development(default) or production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Throw an error if loading the config file failed
const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
    env: process.env.NODE_ENV, // Environment type
    port: parseInt(process.env.PORT, 3000), // Port number
    databaseURL: process.env.DATABASE_URL, // Database connection string
    jwtSecret: process.env.JWT_SECRET, // JWT secret key to use in encryption
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10), // Complexity of salt
    logs: {
        level: process.env.LOG_LEVEL || 'silly', // The error logging level
    },
};
