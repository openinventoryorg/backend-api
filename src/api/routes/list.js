const router = require('express').Router();
const ListService = require('../../services/list');

router.get('/roles', async (req, res, next) => {
    try {
        const roles = await ListService.ListRoles();
        res.status(200).send(roles);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
