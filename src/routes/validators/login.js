const Joi = require('@hapi/joi');

const LoginInformation = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});


module.exports = { LoginInformation };
