const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CUD of supervisors
 * @abstract
 * @category Services
 */
class ManageSupervisorsService {
    /**
     * Creates supervisor with given data.
     * Id will be automatically generated.
     * @param {Object} supervisor Supervisor object to create
     * @param {string} supervisor.firstName firstName of supervisor
     * @param {string} supervisor.lastName lastName of supervisor
     * @param {string} supervisor.bio bio of supervisor
     * @param {string} supervisor.email email of supervisor
     * @returns {Promise<Object>} Created supervisor object
     */
    static async CreateSupervisor({
        firstName, lastName, bio, email,
    }) {
        const database = await getDatabase();

        const sameEmailSupervisor = await database.Supervisor.findOne({ where: { email } });
        if (sameEmailSupervisor) {
            throw new Errors.BadRequest(`Supervisor with email ${email} already exists.`);
        }

        const supervisor = database.Supervisor.build({
            firstName, lastName, bio, email, active: true,
        });
        try {
            await supervisor.save();
        } catch (err) {
            logger.error('Error while saving supervisor: ', err);
            throw new Errors.BadRequest('Invalid data. Supervisor creation failed.');
        }
        return supervisor;
    }
}

module.exports = ManageSupervisorsService;
