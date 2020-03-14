const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');

/**
 * Service that manages CUD of labs
 * @abstract
 * @category Services
 */
class LabsService {
    /**
     * Creates lab with given data.
     * Id will be automatically generated.
     * @param {Object} lab Lab object to create
     * @param {string} lab.title Title of lab
     * @param {string} lab.subtitle Subtitle of lab
     * @param {string} lab.image Image of lab
     * @returns {Promise<Object>} Created lab object
     */
    static async CreateLab({ title, subtitle, image }) {
        const database = await getDatabase();

        const lab = database.Lab.build({ title, subtitle, image });
        try {
            await lab.save();
        } catch (err) {
            logger.error('Error while saving lab: ', err);
            throw new Errors.BadRequest('Invalid data. Lab creation failed.');
        }
        return lab;
    }

    /**
     * Creates lab with given data and ID.
     * @param {Object} lab Lab object to create
     * @param {string} lab.id ID of lab to be created
     * @param {string} lab.title Title of lab
     * @param {string} lab.subtitle Subtitle of lab
     * @param {string} lab.image Image of lab
     * @returns {Promise<Object>} Created lab object
     */
    static async PutLab({
        id, title, subtitle, image,
    }) {
        const database = await getDatabase();

        const existingLab = await database.Lab.findOne({ where: { id } });

        if (existingLab) {
            throw new Errors.BadRequest(`Lab ${id} already exists.`);
        }

        const lab = await database.Lab.build({
            id, title, subtitle, image,
        });

        try {
            lab.save();
        } catch (err) {
            logger.error('Error while updating lab: ', err);
            throw new Errors.BadRequest('Invalid data. Lab update failed.');
        }
        return lab;
    }

    /**
     * Deletes lab with given id.
     * @param {string} id Id of the lab to delete
     */
    static async DeleteLab(id) {
        const database = await getDatabase();

        const existingLab = await database.Lab.findOne({ where: { id } });

        if (!existingLab) {
            throw new Errors.BadRequest(`Lab ${id} does not exist.`);
        }

        try {
            await existingLab.destroy();
        } catch (err) {
            logger.error('Error while deleting lab: ', err);
            throw new Errors.BadRequest('Invalid data. Lab deletion failed.');
        }
    }

    /**
     * Updates lab with given id.
     * All fields will be overridden by new ones.
     * @param {Object} lab Lab object to create
     * @param {string} lab.id ID of lab
     * @param {string} lab.title Title of lab
     * @param {string} lab.subtitle Subtitle of lab
     * @param {string} lab.image Image of lab
     * @returns {Promise<Object>} Created lab object
     */
    static async UpdateLab({
        id, title, subtitle, image,
    }) {
        const database = await getDatabase();

        const existingLab = await database.Lab.findOne({ where: { id } });

        if (!existingLab) {
            throw new Errors.BadRequest(`Lab ${id} does not exist.`);
        }

        try {
            const lab = await existingLab.update({
                id, title, subtitle, image,
            });
            return lab;
        } catch (err) {
            logger.error('Error while updating lab: ', err);
            throw new Errors.BadRequest('Invalid data. Lab update failed.');
        }
    }
}


module.exports = LabsService;
