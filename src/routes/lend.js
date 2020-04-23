const router = require('express').Router();
const LendController = require('../controllers/lend');
const { permissionMiddleware } = require('../middlewares/permission');
const { Requester } = require('../models/schema/permissions');

router.post('/', permissionMiddleware([Requester]), LendController.Lend);

module.exports = router;
