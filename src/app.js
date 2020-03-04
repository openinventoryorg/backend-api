const express = require('express');
const { sendErrorMessage } = require('./middlewares/error_handler');
require('./config');

const app = express();

// Add body json parsing middleware
app.use(require('body-parser').json());

// Enable logging service
const logger = require('./loaders/logger');

// Connect to database
require('./models').catch(() => logger.error('Application faced database connection issues'));

// Configure API middlewares
require('./routes').defineEndPoints(app);

// Error handling middleware
app.use(sendErrorMessage);

app.listen(process.env.PORT, () => logger.info(`Server started on port ${process.env.PORT}`));
