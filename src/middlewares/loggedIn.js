
const Errors = require('../helpers/errors');

const loggedIn = (req, res, next) => {
    const { authenticated } = req;
    if (!authenticated) throw new Errors.Unauthorized('Not logged in');
    next();
};

module.exports = { loggedIn };
