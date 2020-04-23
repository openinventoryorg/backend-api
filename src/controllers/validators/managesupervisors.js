const Joi = require('@hapi/joi');

const CreateSupervisor = Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
});

const SupervisorIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = {
    CreateSupervisor, SupervisorIdQuery,
};
