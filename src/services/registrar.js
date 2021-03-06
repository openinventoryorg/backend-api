const { getDatabase } = require('../helpers/get_database');
const { generateSecureToken } = require('../helpers/secure_token');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const { sendMail } = require('../emails');
const config = require('../config');
const ListService = require('./list');

/**
 * Service associated with associating a registration token with users
 * @abstract
 * @category Services
 */
class RegistrarService {
    /**
     * Send the registration token via email.
     *
     * This checks if the user already has a token,
     * (There shouldn't - if there is that means either invitation already sent
     * or user registered) and then sends the token via
     * email.
     * When the user registers using the token,
     * he/she will be given the role specified in role id.
     *
     * No user can register without a token.
     * @param {string} email Email of the user
     * @param {string} roleId UUID of the role that should be assigned to user
     * @returns {Promise<any>} Created registration token object
     */
    static async SendRegistrationToken(email, roleId) {
        const database = await getDatabase();
        const token = generateSecureToken(96);

        // No need to check if user is already registered
        // since, if the user is registered, the token
        // will be invalid (not deleted).
        // So existence of token shows either,
        // invitation link is already sent or
        // account already created

        const existingToken = await database.RegistrationToken
            .findOne({ where: { email } });
        if (existingToken) {
            throw new Errors
                .BadRequest(`User ${email} is already sent an invitation link or account already created`);
        }

        // Build and save token
        const registrationToken = database.RegistrationToken
            .build({ email, assignedRoleId: roleId, token });
        try {
            await registrationToken.save();

            // Send the mail to the user
            sendMail({
                from: config.mail.sender,
                to: email,
                subject: 'Registration Link - Open Inventory',
                template: 'registration_invite',
                context: {
                    email,
                    link: `${config.site}/register/${token}`,
                },
            });

            // Log the token for now
            logger.info(`Token generated for ${email} on role ${roleId} - ${token}`);
        } catch (err) {
            logger.error('Error while saving registration token: ', err);
            throw new Errors.BadRequest('Invalid data. Token saving failed.');
        }

        return registrationToken;
    }

    /** Send the registration tokens via email.
    *
    * This checks if the users already have tokens,
    * (There shouldn't - if there is that means either invitation already sent
    * or user registered) and then sends the tokens via
    * email.
    * When the user registers using the token,
    * he/she will be given the role specified in role id.
    *
    * No user can register without a token.
    *
    * This is a slow operation.
    *
    * If there is atleast one invalid user, operation will fail.
    * @param {string[]} emails Email of the user
    * @param {string} roleId UUID of the role that should be assigned to user
    */
    static async SendRegistrationTokenList(emails, roleId) {
        const database = await getDatabase();
        const uniqueEmails = [...new Set(emails)];
        const tokens = {};

        try {
            // Transaction to make sure rollback
            await database.sequelize.transaction(async (t) => {
                const promises = uniqueEmails.map(async (email) => {
                    const token = generateSecureToken(96);
                    tokens[email] = token;

                    const existingToken = await database.RegistrationToken.findOne({
                        where: { email },
                    }, { transaction: t });

                    if (existingToken) {
                        throw new Errors
                            .BadRequest(`User ${email} is already sent an invitation link or account already created`);
                    }

                    const registrationToken = database.RegistrationToken
                        .build({ email, assignedRoleId: roleId, token });
                    await registrationToken.save({ transaction: t });
                });

                await Promise.all(promises);
            });
        } catch (err) {
            logger.error('Error while creating registration tokens: ', err);
            if (err instanceof Errors.BadRequest) throw err;
            throw new Errors.BadRequest('Invalid data. Token saving failed.');
        }

        try {
            uniqueEmails.forEach((email) => {
                const token = tokens[email];

                sendMail({
                    from: config.mail.sender,
                    to: email,
                    subject: 'Registration Link - Open Inventory',
                    template: 'registration_invite',
                    context: {
                        email,
                        link: `${config.site}/register/${token}`,
                    },
                });
                logger.info(`Token generated for ${email} on role ${roleId} - ${token}`);
            });
        } catch (err) {
            logger.error('Error while saving registration token: ', err);
        }
    }

    /**
     * Delete the registration token.
     *
     * This checks if the user already has a token,
     * and whether it is valid.
     * Otherwise deletion will fail.
     * @param {string} email Email of the user
     */
    static async DeleteRegistrationToken(email) {
        const database = await getDatabase();

        // To delete registration token, it has to be
        // in created and valid state. (If deleted can't delete,
        // if created and invalid then account is already created)

        const existingActiveToken = await database.RegistrationToken
            .findOne({ where: { email, valid: true } });
        if (!existingActiveToken) {
            throw new Errors
                .BadRequest(`User ${email} is not sent an invitation link or the user has created an account.`);
        }

        try {
            await existingActiveToken.destroy();
        } catch (err) {
            logger.error('Error while deleting registration token: ', err);
            throw new Errors.BadRequest('Invalid data. Token deletion failed.');
        }
    }

    static async CreateInitialAdministratorAccount() {
        try {
            if (config.initializeDatabase) {
                const { roles } = await ListService.ListRoles();
                const adminRole = roles.find((v) => v.name === 'administrator');
                await this.SendRegistrationToken(config.adminEmail, adminRole.id);
            }
        } catch (err) {
            logger.error('Error while creating admin account: ', err);
        }
    }
}


module.exports = RegistrarService;
