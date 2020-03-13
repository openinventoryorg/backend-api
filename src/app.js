const express = require('express');
const { errorHandlerMiddleware } = require('./middlewares/error_handler');
const { jwtAuthMiddleware } = require('./middlewares/jwt_auth');

// Node express application
const app = express();

// Add body json parsing middleware
app.use(require('body-parser').json());

// Enable logging service
const logger = require('./loaders/logger');

// Connect to database
require('./models').catch(() => logger.error('Application faced database connection issues'));

// Authentication Layer
app.use(jwtAuthMiddleware);

// Initialize email sending service
require('./emails');

// Configure API middlewares
require('./routes').defineEndPoints(app);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Listen to the indicated port
app.listen(process.env.PORT, () => logger.info(`Server started on port ${process.env.PORT}`));
