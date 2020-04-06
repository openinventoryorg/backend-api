const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageUsersController = require('../controllers/manageusers');

router.get('/list', permissionMiddleware([]), ManageUsersController.ListUsers);
router.delete('/:id', permissionMiddleware([]), ManageUsersController.DeleteUser);
router.patch('/:id', permissionMiddleware([]), ManageUsersController.UpdateUser);

module.exports = router;
