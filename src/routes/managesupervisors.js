const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageSupervisorController = require('../controllers/managesupervisors');
const { Administrator } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.post('/', permissionMiddleware([Administrator]), ManageSupervisorController.PostSupervisor);
router.delete('/:id', permissionMiddleware([Administrator]), ManageSupervisorController.DeleteSupervisor);
router.get('/', loggedIn, ManageSupervisorController.ListSupervisors);

module.exports = router;
