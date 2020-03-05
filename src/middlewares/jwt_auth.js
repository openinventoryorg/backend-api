const jwt = require('../helpers/jwt');

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.get('token');
    try {
        if (!token) throw Error('JWT Invalid');
        const user = jwt.verify(token);
        req.user = user;
        req.authenticated = true;
    } catch (ignored) {
        req.user = undefined;
        req.authenticated = false;
    }
    next();
};

module.exports = { jwtAuthMiddleware };
