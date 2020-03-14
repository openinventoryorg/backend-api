const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const RegistrarController = require('../controllers/registrar');

router.put('/token', permissionMiddleware([]), RegistrarController.PutToken);
router.delete('/token', permissionMiddleware([]), RegistrarController.DeleteToken);
router.get('/roles', permissionMiddleware([]), RegistrarController.ListRoles);

module.exports = router;
