const Joi = require('@hapi/joi');
const { permissions: listedPermissions } = require('../../models/schema/permissions');

const CreateRole = Joi.object().keys({
    name: Joi.string().lowercase({ force: true }).required(),
    permissions: Joi.array().min(1).items(Joi.string().valid(...listedPermissions)).required(),
});

const CreateRoleQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().lowercase({ force: true }).required(),
    permissions: Joi.array().min(1).items(Joi.string().valid(...listedPermissions)).required(),
});

const RoleIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = { CreateRole, RoleIdQuery, CreateRoleQuery };
