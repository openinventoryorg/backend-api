const logger = require('../loaders/logger');
const { initializeSendgridTransport } = require('./sendgrid');

/**
 * Promised future of transport to be used by sendmail method.
 */
const emailTransportPromise = initializeSendgridTransport();

/**
 * Sends an email to the given url using a given template
 * Don't await at this function as this will take a
 * considerable amount of time to finish.
 *
 * @param {Object} email Email object that should be sent
 * @param {string} email.from Sender of the email
 * @param {string} email.to Recipient of the email
 * @param {string} email.subject Subject of the email
 * @param {string} email.template Email template to use
 * @param {Object} email.context Context Object
 */
const sendMail = async (email) => {
    try {
        const transport = await emailTransportPromise;
        if (transport === null) {
            logger.error('Email account initiation has failed!');
            return;
        }
        await transport.sendMail(email);
        logger.info(`Email sent to ${email.to}`);
    } catch (err) {
        logger.error('Email sending failure: ', err);
    }
};

module.exports = { sendMail };
