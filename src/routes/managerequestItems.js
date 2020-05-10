const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const { Requester } = require('../models/schema/permissions');
const ManageRequestItemsController = require('../controllers/managerequestitems');

router.post('/create', permissionMiddleware([Requester]), ManageRequestItemsController.CreateItemsRequest);

module.exports = router;