const Joi = require('@hapi/joi');

const CreateLab = Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    image: Joi.string().max(1023).required()
        .allow(null),
});

const CreateLabQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    subtitle: Joi.string().required(),
    image: Joi.string().max(1023).required()
        .allow(null),
});


const LabIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

const LabAndUserQuery = Joi.object().keys({
    labId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
});

module.exports = {
    CreateLab, LabIdQuery, CreateLabQuery, LabAndUserQuery,
};
