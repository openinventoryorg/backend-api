const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageRolesController = require('../controllers/manageroles');

router.post('/create', permissionMiddleware([]), ManageRolesController.PostRole);
router.get('/list', permissionMiddleware([]), ManageRolesController.ListRoles);
router.patch('/:id', permissionMiddleware([]), ManageRolesController.UpdateRole);
router.delete('/:id', permissionMiddleware([]), ManageRolesController.DeleteRole);
router.get('/:id', permissionMiddleware([]), ManageRolesController.GetRole);

module.exports = router;
