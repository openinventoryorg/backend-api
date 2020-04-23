const Joi = require('@hapi/joi');

const LendInformation = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    supervisor: Joi.string().uuid().required(),
    title: Joi.string().required(),
    reason: Joi.string(),
    items: Joi.array().items(
        Joi.string().required(),
    ),
});


module.exports = { LendInformation };
