const Joi = require('@hapi/joi');

const RegistrationTokenGenerationRequest = Joi.object().keys({
    email: Joi.string().email().required(),
    role: Joi.string().uuid().required(),
});

const RegistrationTokenListRequest = Joi.object().keys({
    emails: Joi.array().min(1).items(Joi.string().email()).required(),
    role: Joi.string().uuid().required(),
});

const EmailBasedRequest = Joi.object().keys({
    email: Joi.string().email().required(),
});


module.exports = {
    RegistrationTokenGenerationRequest,
    EmailBasedRequest,
    RegistrationTokenListRequest,
};
