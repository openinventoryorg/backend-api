const router = require('express').Router();
const RegistrationService = require('../services/registration');
const { RegistrationTokenQuery, UserInformation } = require('./validators/registration');

// Uses an email token and returns user details of the associated user
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

// Registers a user according to a token, name and password
router.post('/register', async (req, res, next) => {
    try {
        const { value, error } = UserInformation.validate(req.body);
        if (error) throw error;

        await RegistrationService
            .Register(value.token, value.firstName, value.lastName, value.password);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
