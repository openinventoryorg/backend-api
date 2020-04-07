const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageItemsetsController = require('../controllers/manageitemsets');
const { LabManager, InventoryManager } = require('../models/schema/permissions');

router.post('/create', permissionMiddleware([LabManager, InventoryManager]), ManageItemsetsController.PostItemset);
router.get('/list', permissionMiddleware([LabManager, InventoryManager]), ManageItemsetsController.ListItemsets);
router.get('/:id', permissionMiddleware([LabManager, InventoryManager]), ManageItemsetsController.GetItemset);
router.delete('/:id', permissionMiddleware([LabManager, InventoryManager]), ManageItemsetsController.DeleteItemset);
router.patch('/:id', permissionMiddleware([LabManager, InventoryManager]), ManageItemsetsController.UpdateItemset);

module.exports = router;
