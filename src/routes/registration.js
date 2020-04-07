const router = require('express').Router();
const RegistrationController = require('../controllers/registration');
const { notLoggedIn } = require('../middlewares/notLoggedIn');

router.get('/verify/:token', notLoggedIn, RegistrationController.Verify);
router.post('/register', notLoggedIn, RegistrationController.Register);

module.exports = router;
