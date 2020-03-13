const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const logger = require('../loaders/logger');

/**
 * Initializes ethereal email trasnport by useing a test account.
 *
 * This also initializes the handlebar view engine for email templates.
 * This will throw an error if initialization failed.
 * @todo Add real email sender transport
 * @returns {Promise<Mail>} Transporter promise
 */
const initializeEtherealMailTransport = async () => {
    try {
        // Generate test SMTP service account from ethereal.email
        const etherealUser = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: etherealUser,
        });

        // Set directories
        const templatesDir = path.join(__dirname, 'templates');

        // Define handlebar options
        const handlebarOptions = {
            viewEngine: {
                extName: '.hbs',
                partialsDir: templatesDir,
                layoutsDir: templatesDir,
                defaultLayout: '',
            },
            viewPath: templatesDir,
            extName: '.hbs',
        };

        // Use handlebar as the template engine
        transporter.use('compile', hbs(handlebarOptions));

        logger.info(`Ethereal account created: ${etherealUser.user} | ${etherealUser.pass}`);
        return transporter;
    } catch (err) {
        logger.error('Email Sender account connection issue: ', err);
        throw err;
    }
};

/**
 * Promised future of ethereal transport to be used by sendmail method.
 */
const transportPromise = initializeEtherealMailTransport();

/**
 * Sends an email to the given url using a given template
 * Don't await at this function as this will take a
 * considerable amount of time to finish.
 *
 * @param {Promise<{from: string, to: string,
 * subject: string, template: string, context: {any}}>} email
 * Email object that should be sent
 */
const sendMail = async (email) => {
    try {
        const transport = await transportPromise;
        const info = await transport.sendMail(email);
        logger.info('Email Sent [URL] %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
        logger.error('Email sending failure: ', err);
    }
};

module.exports = { sendMail };
