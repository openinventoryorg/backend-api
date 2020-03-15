const router = require('express').Router();
const DemoController = require('../controllers/demo');
const { permissionMiddleware } = require('../middlewares/permission');
const permissions = require('../models/schema/permissions');

router.get('/', permissionMiddleware([permissions.Requester]), DemoController.Demo);

module.exports = router;
