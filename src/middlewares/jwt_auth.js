const { jwtVerify } = require('../helpers/jwt');

/**
 * Middleware that intercepts the request of a user and
 * verifies the JWT of a user(if any).
 *
 * This uses header[token] to authenticate user.
 * If authentication fails, `req.user` = `undefined` and
 * `req.authenticated` = `false`.
 * Otherwise `req.user` = `user object` and
 * `req.authenticated` = `true`.
 *
 * This should be added as an middleware
 * before any permission checking middlewares.
 * @category Middlewares
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next callback
 */
const jwtAuthMiddleware = (req, res, next) => {
    const token = req.get('token');
    try {
        if (!token) throw Error('JWT Invalid');
        // Will throw an error if verification failed
        const user = jwtVerify(token);
        req.user = user;
        req.authenticated = true;
    } catch (ignored) {
        req.user = undefined;
        req.authenticated = false;
    }
    next();
};

module.exports = { jwtAuthMiddleware };
