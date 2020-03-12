const router = require('express').Router();
const LoginController = require('../controllers/login');

router.post('/', LoginController.Login);

module.exports = router;
