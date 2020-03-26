const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const config = require('../config');
const logger = require('../loaders/logger');


/**
 * Initializes ethereal email trasnport by useing a test account.
 * Fallbacks into json transport on an error.
 *
 * This also initializes the handlebar view engine for email templates.
 * This will throw an error if initialization failed.
 * @todo Add real email sender transport
 * @returns {Promise<Mail>} Transporter promise
 */
const initializeEtherealMailTransport = async () => {
    try {
        // create reusable transporter object using the ethereal SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: config.mail.etherealUsername,
                pass: config.mail.etherealPassword,
            },
        });
        logger.info('Logged into etheral account');

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
        return transporter;
    } catch (err) {
        logger.error(`Something went wrong: ${err.message}`);
        return null;
    }
};

module.exports = { initializeEtherealMailTransport };
