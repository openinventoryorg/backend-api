const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const config = require('../config');
const logger = require('../loaders/logger');


const initializeSendgridTransport = async () => {
    try {
        const transporter = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: config.mail.sendGridApiKey,
            }),
        );
        logger.info('Created send grid transport');

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

module.exports = { initializeSendgridTransport };
