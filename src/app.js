const express = require('express');
require('./config');

const app = express();

// Add body json parsing middleware
app.use(require('body-parser').json());

// Enable logging service
const logger = require('./loaders/logger');

// Connect to database
require('./models').catch(() => logger.error('Application faced database connection issues'));

// Configure API middlewares
require('./api').defineEndPoints(app);

app.listen(process.env.PORT, () => logger.info(`Server started on port ${process.env.PORT}`));
