const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const { Requester, LabManager, InventoryManager } = require('../models/schema/permissions');
const ManageRequestItemsController = require('../controllers/managerequestitems');

router.post('/create', permissionMiddleware([Requester]), ManageRequestItemsController.CreateItemsRequest);
router.post('/review', ManageRequestItemsController.GetRequestAction);
router.get('/:token', ManageRequestItemsController.GetItemsRequestByToken);
router.get('/requester/list', permissionMiddleware([Requester]), ManageRequestItemsController.ListItemsRequestsByStudent);
router.get('/lab/list/:labId', permissionMiddleware([LabManager, InventoryManager]), ManageRequestItemsController.ListItemsRequestsByLab);
router.post('/lend', permissionMiddleware([LabManager, InventoryManager]), ManageRequestItemsController.UpdateRequestLend);
router.post('/return', permissionMiddleware([LabManager, InventoryManager]), ManageRequestItemsController.UpdateRequestReturn);

module.exports = router;
