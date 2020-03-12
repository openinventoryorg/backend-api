const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const jwt = require('../helpers/jwt');
const { checkPassword } = require('../helpers/password');

/**
 * Service associated with logging in the user by generating a token
 */
class LoginService {
    /**
     * Authenticate and log the user in.
     *
     * This gets hashed password by email and
     * checks if the password match.
     * If they match, this function would generate and
     * send the token.
     * Otherwise an error would be thrown.
     * @param {string} email Email of the user
     * @param {string} password Password of the user
     * @returns {Promise<{token: string, user: any}>} List of roles in the database
     */
    static async Login(email, password) {
        const database = await getDatabase();

        // User matching the given email, also fetch all required fields for token generation
        const user = await database.User
            .findOne({
                where: { email },
                attributes: ['id', 'firstName', 'lastName', 'email', 'password'],
                include: [{
                    model: database.Role,
                    attributes: ['id', 'name'],
                    include: [{
                        model: database.RolePermission,
                        attributes: [['permissionId', 'name']],
                    }],
                }],
            });

        // Check user existence
        if (!user) throw new Errors.BadRequest('Email isn\'t registered in the system');

        // Authenticate user password
        const isValid = await checkPassword(password, user.password);
        if (!isValid) throw new Errors.BadRequest('Email/Password mismatch');

        // Get a json copy of model and format it to add the fields we need
        const userInformation = user.toJSON();
        userInformation.permissions = userInformation.Role.RolePermissions.map((rp) => rp.name);
        userInformation.role = userInformation.Role.name;
        userInformation.roleId = userInformation.Role.id;

        // Unbind all unrequired fields
        userInformation.Role = undefined;
        userInformation.password = undefined;

        const signedJwt = jwt.sign(userInformation);

        return { token: signedJwt, user: userInformation };
    }
}


module.exports = LoginService;
