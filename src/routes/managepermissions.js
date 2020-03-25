const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManagePermissionsController = require('../controllers/managepermissions');

router.get('/roles', permissionMiddleware([]), ManagePermissionsController.ListRolePermissions);

module.exports = router;
