const { remindItemRequestDeadline } = require('../src/jobs/reminder_emails');
const logger = require('../src/loaders/logger');

async function main() {
    try {
        await remindItemRequestDeadline();
    } catch (err) {
        logger.error(err);
    }
}

main();
