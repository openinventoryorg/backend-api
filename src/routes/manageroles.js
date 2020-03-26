const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageRolesController = require('../controllers/manageroles');

router.post('/create', permissionMiddleware([]), ManageRolesController.PostRole);
router.get('/list', ManageRolesController.ListRoles);
router.patch('/:id', permissionMiddleware([]), ManageRolesController.UpdateRole);
router.delete('/:id', permissionMiddleware([]), ManageRolesController.DeleteRole);
router.get('/:id', ManageRolesController.GetRole);

module.exports = router;
