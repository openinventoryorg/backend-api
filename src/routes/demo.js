const router = require('express').Router();
const DemoController = require('../controllers/demo');
const { permissionMiddleware } = require('../middlewares/permission');
const permissions = require('../models/schema/permissions');

router.post('/', permissionMiddleware([permissions.Requester]), DemoController.DemoNodeMailer);

module.exports = router;
