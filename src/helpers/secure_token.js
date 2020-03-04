const crypto = require('crypto');

const generateSecureToken = () => {
    const token = crypto.randomBytes(48).toString('hex');
    return token;
};

module.exports = { generateSecureToken };
