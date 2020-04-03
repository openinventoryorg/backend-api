const router = require('express').Router();
const ManageUsersController = require('../controllers/manageusers');

router.get('/list', ManageUsersController.ListUsers);

module.exports = router;
