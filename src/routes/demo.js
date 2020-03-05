const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        res.status(200).send({ message: 'Congrats, you are registered' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
