const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageItemsController = require('../controllers/manageitems');

router.post('/create', permissionMiddleware([]), ManageItemsController.PostItem);
router.get('/list', ManageItemsController.ListItems);
router.get('/:id', permissionMiddleware([]), ManageItemsController.GetItem);
router.delete('/:id', permissionMiddleware([]), ManageItemsController.DeleteItem);
router.patch('/:id', permissionMiddleware([]), ManageItemsController.UpdateItem);

module.exports = router;
