const Joi = require('@hapi/joi');

const createItemsRequest = Joi.object().keys({
    itemIds: Joi.array().items(Joi.string().uuid().required()),
    requestId: Joi.string().uuid().required(),
    title: Joi.string().required(),
    supervisorId: Joi.string().uuid(),
    reason: Joi.string(),
});

module.exports = { createItemsRequest };
