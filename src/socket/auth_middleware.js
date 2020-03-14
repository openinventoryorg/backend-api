const { jwtVerify } = require('../helpers/jwt');
const logger = require('../loaders/logger');


/**
 * Acts as a middleware for sockets.
 *
 * This verifies that a socket presents a valid token and
 * client details.
 * If the data is not present, this does not allow to continue.
 * @category Middlewares
 * @param {WebSocket} socket Incoming socket connection
 * @param {NextFunction} next Next callback
 */
const jwtSocketAuthMiddleware = (socket, next) => {
    try {
        if (!socket.handshake.query) throw Error('JWT Invalid');
        const { token, client } = socket.handshake.query;
        if (!token) throw Error('JWT Invalid');
        if (!client) throw Error('Client not defined');
        // Will throw an error if verification failed
        const user = jwtVerify(token);
        // eslint-disable-next-line no-param-reassign
        socket.user = user;
        // eslint-disable-next-line no-param-reassign
        socket.clientType = client;
        next();
    } catch (ignored) {
        logger.warn('Unauthorized user tried to connect to socket');
    }
};


module.exports = { jwtSocketAuthMiddleware };
