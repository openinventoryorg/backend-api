const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const { LabManager, InventoryManager } = require('../models/schema/permissions');
const ManageTemporaryRequestsController = require('../controllers/managetemporaryrequests');

router.post('/lend', permissionMiddleware([LabManager, InventoryManager]), ManageTemporaryRequestsController.CreateTemporaryLendRequest);
router.post('/return', permissionMiddleware([LabManager, InventoryManager]), ManageTemporaryRequestsController.UpdateTemporaryLendRequest);
router.get('/list', permissionMiddleware([InventoryManager]), ManageTemporaryRequestsController.ListTemporaryLendRequests);


module.exports = router;
