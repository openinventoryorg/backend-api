const express = require('express');
const cors = require('cors');
const { errorHandlerMiddleware } = require('./middlewares/error_handler');
const { jwtAuthMiddleware } = require('./middlewares/jwt_auth');

// Node express application
const app = express();


// Add body json parsing middleware
app.use(require('body-parser').json());

// Avoid CORS same origin error in development

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Enable logging service
const logger = require('./loaders/logger');

// Connect to database
require('./models').catch(() => logger.error('Application faced database connection issues'));

// Authentication Layer
app.use(jwtAuthMiddleware);

// Configure API middlewares
require('./routes').defineEndPoints(app);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Listen to the indicated port
app.listen(process.env.PORT, () => logger.info(`Server started on port ${process.env.PORT}`));
