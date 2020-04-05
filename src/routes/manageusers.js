const router = require('express').Router();
// const { permissionMiddleware } = require('../middlewares/permission');
const ManageUsersController = require('../controllers/manageusers');

router.get('/list', ManageUsersController.ListUsers);
router.delete('/:id', ManageUsersController.DeleteUsers);
router.patch('/:id', ManageUsersController.UpdateUsers);
module.exports = router;
