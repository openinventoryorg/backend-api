const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageLabsController = require('../controllers/managelabs');

router.post('/create', permissionMiddleware([]), ManageLabsController.PostLab);
router.put('/:id', permissionMiddleware([]), ManageLabsController.PutLab);
router.delete('/:id', permissionMiddleware([]), ManageLabsController.DeleteLab);
router.patch('/:id', permissionMiddleware([]), ManageLabsController.UpdateLab);
router.get('/list', permissionMiddleware([]), ManageLabsController.ListLabs);

module.exports = router;
