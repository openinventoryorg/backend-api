const { Administrator } = require('../models/schema/permissions');
const Errors = require('../helpers/errors');

const permissionMiddleware = (allowedPermissions) => (req, res, next) => {
    try {
        if (req.authenticated) {
            const { permissions } = req.user;
            if (permissions.includes(Administrator)) {
                next();
                return;
            }

            const commonPermissions = allowedPermissions
                .filter((v) => permissions.includes(v));
            if (commonPermissions.length !== 0) {
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
