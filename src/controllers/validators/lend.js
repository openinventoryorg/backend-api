const Joi = require('@hapi/joi');

const LendInformation = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    supervisor: Joi.string().uuid().required(),
    title: Joi.string().required(),
    reason: Joi.string(),
    labId: Joi.string().uuid().required(),
    items: Joi.array().min(1).max(4).items(
        Joi.string().required(),
    )
        .required(),
});


module.exports = { LendInformation };
