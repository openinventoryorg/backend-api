const bcrypt = require('bcrypt');
const config = require('../config');

/**
 * Hashes a password to make it secure.
 * @param  {string} password Real password to be hashed
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = (password) => bcrypt.hash(password, config.saltRounds);

/**
 * Checks if a password is correct.
 *
 * @param  {string} password Password that user gave
 * @param  {string} hashedPassword Hashed version of the real password
 * @returns {Promise<boolean>} Whether or not the password is correct
 */
const checkPassword = (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, checkPassword };
