const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const { LabManager, InventoryManager } = require('../models/schema/permissions');
const ManageTemporaryRequestsController = require('../controllers/managetemporaryrequests');

router.post('/lend/temporary', permissionMiddleware([LabManager, InventoryManager]), ManageTemporaryRequestsController.ManageTemporaryLendRequest);

module.exports = router;
