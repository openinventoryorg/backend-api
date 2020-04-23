const { getDatabase } = require('../helpers/get_database');
const Errors = require('../helpers/errors');
const logger = require('../loaders/logger');


class Supervisor {
    static async CreateSupervisor({ firstName, lastName, email }) {
        const database = await getDatabase();

        const supervisor = await database.Supervisor.findOne({
            where: { email },
        });

        if (supervisor) {
            throw new Errors.BadRequest(`Supervisor ${email} already registered.`);
        }

        const newSupervisor = database.Supervisor.build({
            firstName,
            lastName,
            email,
        });
        try {
            const createdSupervisor = await newSupervisor.save();

            return {
                id: createdSupervisor.id,
                firstName: createdSupervisor.firstName,
                lastName: createdSupervisor.lastName,
                email: createdSupervisor.email,
            };
        } catch (err) {
            logger.error('Error while creating supervisor: ', err);
            throw new Errors.BadRequest('Invalid data. Registering supervisor failed.');
        }
    }


    static async DeleteSupervisor(id) {
        const database = await getDatabase();

        const supervisor = await database.Supervisor.findOne({
            where: { id },
        });

        if (!supervisor) {
            throw new Errors.BadRequest(`Supervisor ${id} does not exist.`);
        }

        try {
            await supervisor.destroy();
        } catch (error) {
            logger.error('Error while deleting Supervisor: ', error);
            throw new Errors.BadRequest('Invalid data. Supervisor deletion failed.');
        }
    }
}

module.exports = Supervisor;
