const router = require('express').Router();
const ManagePermissionsController = require('../controllers/managepermissions');

router.get('/list', ManagePermissionsController.ListRolePermissions);

module.exports = router;
