const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');
const { LabManager } = require('../models/schema/permissions');

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

        const sameTitleLabs = await database.Lab.findOne({ where: { title } });
        if (sameTitleLabs) {
            throw new Errors.BadRequest(`Lab with title ${title} already exists.`);
        }

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
     * Lab need to have no items in order to be eligible to be deleted.
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

    /**
     * Assigns a user with a given userId to a lab with a given labId
     * @param {string} labId id of the lab
     * @param {string} userId id of the user
     */
    static async AssignUserstoLabs({ labId, userId }) {
        const database = await getDatabase();

        const user = await database.User.findOne({ where: { id: userId } });
        const lab = await database.Lab.findOne({ where: { id: labId } });

        if (!user) {
            throw new Errors.BadRequest(`User ${userId} does not exist.`);
        } else if (!lab) {
            throw new Errors.BadRequest(`Lab ${labId} does not exist.`);
        }

        const isAPermittedUser = await database.RolePermission.findOne({
            where: {
                roleId: user.roleId,
                permissionId: LabManager,
            },
        });
        // checks for permissions to be assigned to a lab
        if (!isAPermittedUser) {
            throw new Errors.BadRequest(`User ${userId} has not enough permissions.`);
        }

        // create relation if its not prev. created
        try {
            const [, created] = await database.LabAssign.findOrCreate({
                where: { labId, userId },
            });
            if (!created) {
                throw new Errors.BadRequest('User is already assigned to the lab');
            }
        } catch (err) {
            logger.error('Error while assigning the user to the lab: ', err);
            throw new Errors.BadRequest('Lab assignment failed. Please try again');
        }
    }

    /**
     * unassigns a user with a given userId from a lab with a given labId
     * @param {string} labId id of the lab
     * @param {string} userId id of the user
     */
    static async UnassignUsersFromLabs({ labId, userId }) {
        const database = await getDatabase();

        const assignedUser = await database.LabAssign.findOne({ where: { userId, labId } });

        if (!assignedUser) {
            throw new Errors.BadRequest(`User ${userId} assigned to Lab ${labId} relation does not exist.`);
        }
        try {
            await assignedUser.destroy();
        } catch (err) {
            logger.error('Error while deleting the User assignment: ', err);
            throw new Errors.BadRequest('Lab unassignment failed. Please try again');
        }
    }
}


module.exports = LabsService;
