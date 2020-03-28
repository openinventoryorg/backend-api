const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const RegistrarController = require('../controllers/registrar');

router.post('/token', permissionMiddleware([]), RegistrarController.PostTokens);
router.put('/token', permissionMiddleware([]), RegistrarController.PutToken);
router.delete('/token', permissionMiddleware([]), RegistrarController.DeleteToken);
router.get('/token', permissionMiddleware([]), RegistrarController.GetTokens);
router.get('/roles', permissionMiddleware([]), RegistrarController.ListRoles);

module.exports = router;
