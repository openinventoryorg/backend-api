const Joi = require('@hapi/joi');

const CreateSupervisor = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    bio: Joi.string().allow(null),
    email: Joi.string().email().required(),
});

module.exports = { CreateSupervisor };
