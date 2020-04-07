const router = require('express').Router();
const LoginController = require('../controllers/login');
const { notLoggedIn } = require('../middlewares/notLoggedIn');

router.post('/', notLoggedIn, LoginController.Login);
router.get('/verify', LoginController.Verify);

module.exports = router;
