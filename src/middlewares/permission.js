const { Administrator } = require('../models/schema/permissions');
const Errors = require('../helpers/errors');

/**
 * Function that will create a
 * middleware(that intercepts the request of a user and
 * authenticate the user) according to list of permissions provided.
 *
 * This uses decoded token to verify the user.
 * This checks if the user have any common permissions
 * with the list provided as allowed permissions.
 *
 * Unauthenticated users will get a `401` error.
 * @param  {string[]} allowedPermissions List of permissions that is allowed to
 * continue in this middleware.
 */
const permissionMiddleware = (allowedPermissions) => (req, res, next) => {
    try {
        // Check if user had a valid JWT
        if (req.authenticated) {
            const { permissions } = req.user;

            // Administrator can do any task - always authenticated
            if (permissions.includes(Administrator)) {
                next();
                return;
            }

            // Check for common permissions between user and allowedPermissions
            const commonPermissions = allowedPermissions
                .filter((v) => permissions.includes(v));
            if (commonPermissions.length !== 0) {
                // User has common permissions
                next();
                return;
            }
        }
        throw new Errors.Unauthorized('Insufficient permissions');
    } catch (err) {
        next(err);
    }
};

module.exports = { permissionMiddleware };
