const express = require('express');
const socketIo = require('socket.io');

// Node express application
const app = express();
const { errorHandlerMiddleware } = require('./middlewares/error_handler');
const { jwtAuthMiddleware } = require('./middlewares/jwt_auth');

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
const server = app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});

// Socket.io connection
const io = socketIo(server);
const { jwtSocketAuthMiddleware } = require('./socket/auth_middleware');
const onConnection = require('./socket/connection');

// Socket authentication Layer
io.use(jwtSocketAuthMiddleware);

// Listen to socket connections
io.on('connection', onConnection(io));

// Demo Page for socket connection testing
app.get('/socket/demo', (req, res) => {
    res.sendFile(`${__dirname}/socket/demo.html`);
});

// 404 error handler
app.use((req, res) => {
    res.status(404).send({ message: '404 route not found' });
});
