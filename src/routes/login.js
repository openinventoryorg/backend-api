const router = require('express').Router();
const LoginService = require('../services/login');
const { LoginInformation } = require('./validators/login');

router.post('/', async (req, res, next) => {
    try {
        const { value, error } = LoginInformation.validate(req.body);
        if (error) throw error;

        const registrationToken = await LoginService.Login(value.email, value.password);
        res.status(200).send(registrationToken);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
