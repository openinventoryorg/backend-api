const Joi = require('@hapi/joi');

const RegistrationTokenQuery = Joi.object().keys({
    token: Joi.string().required(),
});


const UserInformation = Joi.object().keys({
    token: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
});


module.exports = {
    RegistrationTokenQuery,
    UserInformation,
};
