const Joi = require('@hapi/joi');
const { permissions: listedPermissions } = require('../../models/schema/permissions');


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

const ListItemsRequestsByStudent = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

const ListItemsRequestsByLab = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    userPermissions: Joi.array().min(1).items(Joi.string().valid(...listedPermissions)).required(),
    labId: Joi.string().uuid().required(),
});

const UpdateRequestLend = Joi.object().keys({
    itemId: Joi.string().uuid().required(),
    requestId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    userPermissions: Joi.array().min(1).items(Joi.string().valid(...listedPermissions)).required(),
});

module.exports = {
    createItemsRequest,
    getItemsRequest,
    getItemsRequestAction,
    ListItemsRequestsByStudent,
    ListItemsRequestsByLab,
    UpdateRequestLend,
};
