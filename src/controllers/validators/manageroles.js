const Joi = require('@hapi/joi');
const { permissions } = require('../../models/schema/permissions');

const CreateRole = Joi.object().keys({
    name: Joi.string().required(),
    rolePermissions: Joi.array().items(Joi.string().valid(...permissions)),
});

const CreateRoleQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    rolePermissions: Joi.array().items(Joi.string().valid(...permissions)),
});


const RoleIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = { CreateRole, RoleIdQuery, CreateRoleQuery };
