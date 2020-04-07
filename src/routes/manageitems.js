const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageItemsController = require('../controllers/manageitems');
const { LabManager, InventoryManager } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

// Lab manager can change any lab, but inventory manager can only change if assigned

router.post('/create', permissionMiddleware([LabManager, InventoryManager]), ManageItemsController.PostItem);
router.get('/list', loggedIn, ManageItemsController.ListItems);
router.post('/transfer', permissionMiddleware([LabManager]), ManageItemsController.TransferItem);
router.get('/:id', loggedIn, ManageItemsController.GetItem);
router.delete('/:id', permissionMiddleware([LabManager, InventoryManager]), ManageItemsController.DeleteItem);
router.patch('/:id', permissionMiddleware([LabManager, InventoryManager]), ManageItemsController.UpdateItem);

module.exports = router;
