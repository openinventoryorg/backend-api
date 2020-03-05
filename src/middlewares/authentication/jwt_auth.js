const jwt = require('../../helpers/jwt');

const jwtAuth = async (req, res, next) => {
    const token = req.get('token');
    try {
        const user = jwt.verify(token);
        req.user = user;
        req.authenticated = true;
    } catch (ignored) {
        if (token) {
            req.tokenError = true;
        } else {
            req.tokenError = true;
        }
        // Ignore errors, user is just not authenticated
        req.user = undefined;
        req.authenticated = false;
    }
    next();
};

module.exports = { jwtAuth };
