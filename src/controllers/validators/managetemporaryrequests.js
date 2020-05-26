const Joi = require('@hapi/joi');
const { permissions: listedPermissions } = require('../../models/schema/permissions');

const CreateTemporaryLendRequests = Joi.object().keys({
    userId: Joi.string().uuid().required(),
    userPermissions: Joi.array().min(1).items(Joi.string().valid(...listedPermissions)).required(),
    serialNumber: Joi.string().lowercase({ force: true }).required(),
    studentId: Joi.string().lowercase({ force: true }).required(),
});

const ListRequestsUsingLab = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = { CreateTemporaryLendRequests, ListRequestsUsingLab };
