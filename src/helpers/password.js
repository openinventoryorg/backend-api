const bcrypt = require('bcrypt');
const config = require('../config');

const hashPassword = (password) => bcrypt.hash(password, config.saltRounds);

const checkPassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, checkPassword };
