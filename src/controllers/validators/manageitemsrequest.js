const Joi = require('@hapi/joi');

const createItemsRequest = Joi.object().keys({
    itemIds: Joi.array().items(Joi.string().uuid().required()).required(),
    labId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    supervisorId: Joi.string().uuid().required(),
    reason: Joi.string(),
});

const getItemsRequest = Joi.object().keys({
    token: Joi.string().length(96).required(),
});

const getItemsRequestAction = Joi.object().keys({
    token: Joi.string().length(96).required(),
    value: Joi.boolean().valid(true, false).required(),
    declineReason: Joi.string().allow(null, '').required(),
});

module.exports = { createItemsRequest, getItemsRequest, getItemsRequestAction };
