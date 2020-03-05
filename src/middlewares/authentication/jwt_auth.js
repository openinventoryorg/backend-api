const jwt = require('../../helpers/jwt');

const jwtAuth = async (req, res, next) => {
    const token = req.get('token');
    try {
        if (!token) throw Error('JWT Invalid');

        const user = jwt.verify(token);
        req.user = user;
        req.authenticated = true;
    } catch (ignored) {
        if (token) {
            req.tokenError = true;
        } else {
            req.tokenError = false;
        }
        req.user = undefined;
        req.authenticated = false;
    }
    next();
};

module.exports = { jwtAuth };
