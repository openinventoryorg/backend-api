const Joi = require('@hapi/joi');

const ItemAttributes = Joi.array().items(
    Joi.object().keys({
        key: Joi.string().max(255).required(),
        value: Joi.string().required(),
    }),
).required();

const CreateItem = Joi.object().keys({
    serialNumber: Joi.string().lowercase({ force: true }).required(),
    itemSetId: Joi.string().uuid().required(),
    labId: Joi.string().uuid().required(),
    attributes: ItemAttributes,
});

const UpdateItem = Joi.object().keys({
    id: Joi.string().uuid().required(),
    attributes: ItemAttributes,
});

const ItemIdQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
});

const ItemTransferQuery = Joi.object().keys({
    id: Joi.string().uuid().required(),
    labId: Joi.string().uuid().required(),
});

module.exports = {
    CreateItem, UpdateItem, ItemIdQuery, ItemTransferQuery,
};
