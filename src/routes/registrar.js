const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const RegistrarController = require('../controllers/registrar');
const { Registrar } = require('../models/schema/permissions');

router.post('/token', permissionMiddleware([Registrar]), RegistrarController.PostTokens);
router.put('/token', permissionMiddleware([Registrar]), RegistrarController.PutToken);
router.delete('/token', permissionMiddleware([Registrar]), RegistrarController.DeleteToken);
router.get('/token', permissionMiddleware([Registrar]), RegistrarController.GetTokens);
router.get('/roles', permissionMiddleware([Registrar]), RegistrarController.ListRoles);

module.exports = router;
