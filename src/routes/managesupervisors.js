const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageSupervisorsController = require('../controllers/managesupervisors');
const { LabManager } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.post('/', permissionMiddleware([LabManager]), ManageSupervisorsController.CreateSupervisor);
router.get('/', loggedIn, ManageSupervisorsController.ListSupervisors);

module.exports = router;
