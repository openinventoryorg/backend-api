const router = require('express').Router();
const RegistrarService = require('../services/registrar');
const ListService = require('../services/list');
const { RegistrationTokenGenerationRequest, EmailBasedRequest } = require('./validators/registrar');

router.put('/token', async (req, res, next) => {
    try {
        const { value, error } = RegistrationTokenGenerationRequest.validate(req.body);
        if (error) throw error;

        await RegistrarService
            .SendRegistrationToken(value.email, value.role);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

router.delete('/token', async (req, res, next) => {
    try {
        const { value, error } = EmailBasedRequest.validate(req.body);
        if (error) throw error;

        await RegistrarService.DeleteRegistrationToken(value.email);
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

router.get('/roles', async (req, res, next) => {
    try {
        const roles = await ListService.ListRoles();
        res.status(200).send(roles);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
