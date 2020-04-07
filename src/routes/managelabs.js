const router = require('express').Router();
const { permissionMiddleware } = require('../middlewares/permission');
const ManageLabsController = require('../controllers/managelabs');
const { LabManager } = require('../models/schema/permissions');
const { loggedIn } = require('../middlewares/loggedIn');

router.post('/create', permissionMiddleware([LabManager]), ManageLabsController.PostLab);
router.put('/:id', permissionMiddleware([LabManager]), ManageLabsController.PutLab);
router.delete('/:id', permissionMiddleware([LabManager]), ManageLabsController.DeleteLab);
router.patch('/:id', permissionMiddleware([LabManager]), ManageLabsController.UpdateLab);
router.get('/:id/items', loggedIn, ManageLabsController.ListLabItems);
router.get('/:id/users/', loggedIn, ManageLabsController.ListAssignedUsers);
router.get('/list', loggedIn, ManageLabsController.ListLabs);
router.post('/assign', permissionMiddleware([LabManager]), ManageLabsController.AssignUserstoLabs);
router.post('/unassign', permissionMiddleware([LabManager]), ManageLabsController.UnassignUsersFromLabs);

module.exports = router;
