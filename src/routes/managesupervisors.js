const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageSupervisorsController = require('../controllers/managesupervisors');
const { LabManager } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.post('/create', permissionMiddleware([LabManager]), ManageSupervisorsController.CreateSupervisor);
router.get('/list', loggedIn, ManageSupervisorsController.ListSupervisors);

module.exports = router;
