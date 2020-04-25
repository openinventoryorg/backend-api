const { spawn } = require('child-process-promise');

const dotenv = require('dotenv');

// Throw an error if loading the config file failed
const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const spawnOptions = { stdio: 'inherit' };
(async () => {
    // Our database URL
    const url = process.env.DATABASE_URL;
    try {
    // Migrate the DB
        await spawn('./node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions);
        console.log('*************************');
        console.log('Migration successful');
    } catch (err) {
    // Oh no!
        console.log('*************************');
        console.log('Migration failed. Error:', err.message);
        process.exit(1);
    }
    process.exit(0);
})();
