const router = require('express').Router();
const database = require('../../models');

router.post('/register', (req, res) => {
    res.send('Route');
});

router.post('/login', async (req, res) => {
    try {
        await (await database).User.create({
            firstName: 'Suner', password: 'dsdsdsds', email: 'kdsuneraavinash@gmail.com',
        });
    } catch (err) {
        res.status(404).send(`Error while creating user: ${err.message}`);
    }
});

module.exports = router;
