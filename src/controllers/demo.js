/**
 * @abstract
 * @category Controllers
 */
class DemoController {
    /**
     * Demo request to check if a user is authenticated
     * @param {any} req Request
     * @param {any} res Response
     * @param {any} next Next callback
     */
    static async Demo(req, res, next) {
        try {
            res.status(200).send({ message: 'Congrats, you are registered' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = DemoController;
