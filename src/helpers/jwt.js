const jwt = require('jsonwebtoken');
const config = require('../config');

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

const verify = (token) => jwt.verify(token, config.jwtSecret);

module.exports = { sign, verify };
