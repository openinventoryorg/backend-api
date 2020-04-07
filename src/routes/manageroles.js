const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageRolesController = require('../controllers/manageroles');
const { Administrator } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.post('/create', permissionMiddleware([Administrator]), ManageRolesController.PostRole);
router.get('/list', loggedIn, ManageRolesController.ListRoles);
router.patch('/:id', permissionMiddleware([Administrator]), ManageRolesController.UpdateRole);
router.delete('/:id', permissionMiddleware([Administrator]), ManageRolesController.DeleteRole);
router.get('/:id', loggedIn, ManageRolesController.GetRole);

module.exports = router;
