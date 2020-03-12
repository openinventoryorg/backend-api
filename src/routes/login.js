const router = require('express').Router();
const LoginService = require('../services/login');
const { LoginInformation } = require('./validators/login');

// Logs a user in and gives the user a token
router.post('/', async (req, res, next) => {
    try {
        const { value, error } = LoginInformation.validate(req.body);
        if (error) throw error;

        const registrationTokenData = await LoginService.Login(value.email, value.password);
        res.status(200).send(registrationTokenData);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
