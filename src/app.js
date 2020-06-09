const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const AdminBro = require('admin-bro');
AdminBro.registerAdapter(require('admin-bro-sequelizejs'));

const config = require('./config');

// Node express application
const app = express();
const { errorHandlerMiddleware } = require('./middlewares/error_handler');
const { jwtAuthMiddleware } = require('./middlewares/jwt_auth');

// use helmet to increase http header security
app.use(helmet());

// Static assets
app.use(express.static('assets'));

// Add body json parsing middleware
app.use(require('body-parser').json());

// Avoid CORS same origin error.
// const { corsErrorHandlerMiddleware } = require('./middlewares/cors_error_handler');

app.use(cors());
// app.use(corsErrorHandlerMiddleware);

// Enable logging service
const logger = require('./loaders/logger');

// Connect to database
require('./models').catch(() => logger.error('Application faced database connection issues'));

// Create initial admin account - will happen iff env variable is set
require('./services/registrar').CreateInitialAdministratorAccount();

// Authentication Layer
app.use(jwtAuthMiddleware);

// Initialize email sending service
require('./emails');

// Configure API middlewares
require('./routes').defineEndPoints(app);

// Error handling middleware
app.use(errorHandlerMiddleware);

const { jwtSocketAuthMiddleware } = require('./socket/auth_middleware');
const onConnection = require('./socket/connection');
const { getDatabase } = require('./helpers/get_database');
const { adminDashboard } = require('./adminbro');

const startServer = async () => {
    if (config.enableAdminPanel) {
        // Initialize admin dashboard
        const db = await getDatabase();
        const { adminBro, adminRouter } = adminDashboard(db);
        app.use(adminBro.options.rootPath, adminRouter);
    }

    // Listen to the indicated port
    const server = app.listen(config.port, () => {
        logger.info(`Server started on port ${config.port}`);
    });

    // Socket.io connection
    const io = socketIo(server).of('/staff');

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
};

startServer();
