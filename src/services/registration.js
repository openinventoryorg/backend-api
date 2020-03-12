const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const { hashPassword } = require('../helpers/password');
/**
 * Service associated with registering the user
 */
class RegistrationService {
    /**
     * Verifies whether a registration token is valid.
     *
     * This checks if the user already has a token and it is valid.
     * Then this will return the user details associated with the token.
     * If the token is invalid, this will throw an error.
     * @param {string} token Registration token
     * @returns {Promise<any>} Associated user details
     */
    static async VerifyRegistrationToken(token) {
        const database = await getDatabase();

        // Token Should be Created, Valid in order
        // To be verified

        const existingToken = await database.RegistrationToken
            .findOne({
                where: { token, valid: true },
                attributes: ['email', ['assignedRoleId', 'roleId']],
                include: [{ model: database.Role, attributes: ['name'] }],
            });
        if (!existingToken) {
            throw new Errors.BadRequest('Invalid token');
        }

        return existingToken;
    }

    /**
     * Creates a user with the given token.
     *
     * This creates the user with the given details.
     * The token has to be valid to create the account.
     * This will invalidate the registration token.
     *
     * Note that user need to explicitly login to receive a JWT token.
     * @param {string} token Registration token of the user
     * @param {string} firstName First name of the user
     * @param {string} lastName Last name of the user
     * @param {string} password Password of the user
     * @returns {Promise<any>} Created user details
     */
    static async Register(token, firstName, lastName, password) {
        const database = await getDatabase();

        // Token should be created and valid to use it
        // If valid, take the email and role from token
        // And then use that to save user

        const existingToken = await database.RegistrationToken
            .findOne({
                where: { token, valid: true },
            });
        if (!existingToken) {
            throw new Errors.BadRequest('Invalid token');
        }

        const { email, assignedRoleId } = existingToken;
        const hashedPassword = await hashPassword(password);

        const user = database.User.build({
            firstName,
            lastName,
            email,
            active: true,
            roleId: assignedRoleId,
            password: hashedPassword,
        });
        try {
            await user.save();
            await existingToken.update({ valid: false });
        } catch (err) {
            logger.error('Error while creating user: ', err);
            throw new Errors.BadRequest('Invalid data. Registering user failed.');
        }

        return user;
    }
}


module.exports = RegistrationService;
