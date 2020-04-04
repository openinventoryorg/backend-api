const Joi = require('@hapi/joi');

const UserIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = UserIdQuery;
