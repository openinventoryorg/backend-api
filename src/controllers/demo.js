const { sendMail } = require('../emails');

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
    static async DemoNodeMailer(req, res, next) {
        try {
            sendMail(
                {
                    from: '"Fred Foo 👻" <foo@example.com>',
                    to: 'kdsuneraavinash@gmail.com',
                    template: 'mars',
                    context: { name: 'Elon' },
                },
            );
            res.status(200).send({ message: 'Email sending queued successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = DemoController;
