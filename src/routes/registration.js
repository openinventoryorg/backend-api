const router = require('express').Router();
const RegistrationController = require('../controllers/registration');

router.get('/verify/:token', RegistrationController.Verify);
router.post('/register', RegistrationController.Register);

module.exports = router;
