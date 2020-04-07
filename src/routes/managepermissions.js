const router = require('express').Router();
const ManagePermissionsController = require('../controllers/managepermissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.get('/list', loggedIn, ManagePermissionsController.ListRolePermissions);

module.exports = router;
