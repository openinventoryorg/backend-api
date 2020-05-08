const Joi = require('@hapi/joi');

const createItemsRequest = Joi.object().keys({
    itemIds: Joi.array().items(Joi.string().uuid().required()).required(),
    labId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    supervisorId: Joi.string().uuid().required(),
    reason: Joi.string(),
});

module.exports = { createItemsRequest };
