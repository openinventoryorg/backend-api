const Joi = require('@hapi/joi');

// defaultValue can be null iff editable is true
const Attributes = Joi.array().min(1).items(
    Joi.object().keys({
        key: Joi.string().max(255).required(),
        editable: Joi.boolean().required(),
        defaultValue: Joi.string().required().when('editable', {
            is: true,
            then: Joi.allow(null),
        }),
    }),
).required();

const CreateItemset = Joi.object().keys({
    title: Joi.string().lowercase({ force: true }).required(),
    image: Joi.string().max(1023).allow(null),
    attributes: Attributes,
});

const CreateItemsetQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    title: Joi.string().lowercase({ force: true }).required(),
    image: Joi.string().max(1023).uri().allow(null),
    attributes: Attributes,
});

const ItemsetIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

module.exports = { CreateItemset, CreateItemsetQuery, ItemsetIdQuery };
