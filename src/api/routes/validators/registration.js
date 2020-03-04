const Joi = require('@hapi/joi');

const RegistrationTokenQuery = Joi.object().keys({
    token: Joi.string().required(),
});

module.exports = {
    RegistrationTokenQuery,
};
