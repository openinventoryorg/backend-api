const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
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
        // Generate test SMTP service account from ethereal.email
        const etherealUser = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { etherealUser },
        });
        logger.info(`Ethereal account created: ${etherealUser.user} | ${etherealUser.pass}`);

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
