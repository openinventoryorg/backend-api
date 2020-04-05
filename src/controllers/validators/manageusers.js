const Joi = require('@hapi/joi');

const UserIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

const UpdateUserQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),


});
module.exports = { UserIdQuery, UpdateUserQuery };
