const router = require('express').Router();
const RegistrationService = require('../../services/registration');
const { RegistrationTokenQuery } = require('./validators/registration');

router.get('/verify', async (req, res, next) => {
    try {
        const { value, error } = RegistrationTokenQuery.validate(req.body);
        if (error) throw error;

        const registrationToken = await RegistrationService
            .VerifyRegistrationToken(value.token);
        res.status(200).send(registrationToken);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
