const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const permissions = require('../models/schema/permissions');
const RegistrarController = require('../controllers/registrar');

router.put('/token', permissionMiddleware([permissions.Administrator]), RegistrarController.PutToken);
router.delete('/token', permissionMiddleware([permissions.Administrator]), RegistrarController.DeleteToken);
router.get('/roles', permissionMiddleware([permissions.Administrator]), RegistrarController.ListRoles);

module.exports = router;
