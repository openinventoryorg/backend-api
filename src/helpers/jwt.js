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
 * @param {Object} user User details object
 * @param {string} user.id User id
 * @param {string} user.firstName User first name
 * @param {string} user.lastName User last name
 * @param {string} user.email User email address
 * @param {string[]} user.permissions List of permissions of the user
 * @param {string} user.role Role of the user
 * @param {string} user.roleId Id of the role
 * @returns {string} signed JWT token
 */
const jwtSign = ({
    id, firstName, lastName, email, permissions, role, roleId,
}) => jwt.sign(
    {
        id,
        firstName,
        lastName,
        email,
        permissions,
        role,
        roleId,
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
const jwtVerify = (token) => jwt.verify(token, config.jwtSecret);

module.exports = { jwtSign, jwtVerify };
