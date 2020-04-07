
const Errors = require('../helpers/errors');

const notLoggedIn = (req, res, next) => {
    const { authenticated } = req;
    if (authenticated) throw new Errors.Forbidden('Already logged in');
    next();
};

module.exports = { notLoggedIn };
