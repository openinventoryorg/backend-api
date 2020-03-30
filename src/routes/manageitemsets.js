const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageItemsetsController = require('../controllers/manageitemsets');

router.post('/create', permissionMiddleware([]), ManageItemsetsController.PostItemset);
router.get('/list', ManageItemsetsController.ListItemsets);
router.get('/:id', permissionMiddleware([]), ManageItemsetsController.GetItemset);
router.delete('/:id', permissionMiddleware([]), ManageItemsetsController.DeleteItemset);
router.patch('/:id', permissionMiddleware([]), ManageItemsetsController.UpdateItemset);

module.exports = router;
