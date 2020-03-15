const router = require('express').Router();
const LoginController = require('../controllers/login');

router.post('/', LoginController.Login);
router.get('/verify', LoginController.Verify);

module.exports = router;
