const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageUsersController = require('../controllers/manageusers');
const { Administrator, LabManager } = require('../models/schema/permissions');

router.get('/list/inventorymanagers', permissionMiddleware([LabManager]), ManageUsersController.ListInventoryManagers);
router.get('/list', permissionMiddleware([Administrator]), ManageUsersController.ListUsers);
router.delete('/:id', permissionMiddleware([Administrator]), ManageUsersController.DeleteUser);
router.patch('/:id', permissionMiddleware([Administrator]), ManageUsersController.UpdateUser);

module.exports = router;
