const Joi = require('@hapi/joi');

const CreateTemporaryLendRequests = Joi.object().keys({
    itemId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    state: Joi.string().valid('BORROWED', 'RETURNED'),
});

module.exports = { CreateTemporaryLendRequests };
