const router = require('express').Router();
const RegistrarService = require('../../services/registrar');

router.post('/token/generate', async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const registrationToken = await RegistrarService.SendRegistrationToken(email, role);
        res.status(200).send(registrationToken);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
