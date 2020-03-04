const Joi = require('@hapi/joi');

const RegistrationTokenGenerationRequest = Joi.object().keys({
    email: Joi.string().email(),
    role: Joi.string().uuid(),
});


module.exports = { RegistrationTokenGenerationRequest };
