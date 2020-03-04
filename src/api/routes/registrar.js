const router = require('express').Router();
const RegistrarService = require('../../services/registrar');
const { RegistrationTokenGenerationRequest } = require('./validators/registrar');

router.post('/token/generate', async (req, res, next) => {
    try {
        const { value, error } = RegistrationTokenGenerationRequest.validate(req.body);
        if (error) throw error;

        const registrationToken = await RegistrarService
            .SendRegistrationToken(value.email, value.role);
        res.status(200).send(registrationToken);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
