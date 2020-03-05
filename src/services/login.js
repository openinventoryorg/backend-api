const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
// const logger = require('../loaders/logger');
const jwt = require('../helpers/jwt');
const { checkPassword } = require('../helpers/password');

class LoginService {
    static async Login(email, password) {
        const database = await getDatabase();

        // Get hashed password by email =>
        // Check if password matches =>
        // Generate JWT =>
        // Send the token

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

        return { token: signedJwt };
    }
}


module.exports = LoginService;
