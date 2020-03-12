const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Signs a user using the JWT secret.
 *
 * Here all the user details are signed.
 * User permissions and roles are also signed to
 * make authenticating fast.
 * As a result the token may need to be blacklisted if
 * the user permission/roles change.
 * @param {user} user user information object
 * @returns {string} signed JWT token
 */
const sign = (user) => jwt.sign(
    {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        permissions: user.permissions,
        role: user.role,
        roleId: user.roleId,
    },
    config.jwtSecret,
);

/**
 * Synchronously verify given token using the secret key to get a decoded token.
 *
 * This returns the user object if successfull.
 * This throws as error upon failure.
 * @param {string} token JWT string to verify
 * @returns {user} The decoded token which contains user information.
 */
const verify = (token) => jwt.verify(token, config.jwtSecret);

module.exports = { sign, verify };
