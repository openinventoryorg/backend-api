const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 3000),
    databaseURL: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
};
