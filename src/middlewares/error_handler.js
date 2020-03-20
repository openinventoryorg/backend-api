const { ValidationError } = require('@hapi/joi');
const Errors = require('../helpers/errors');

/**
 * Middleware that intercepts errors and throws the corresponding JSON
 * response to the client.
 *
 * This should be added as the last middleware.
 *
 * Note: next is required even if it is not used since,
 * Express will identify this as an error handler iff
 * it has 4 parameters listed.
 * @category Middlewares
 * @param  {Error} err Error object
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next callback
 */
// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof Errors.BadRequest) {
        res.status(400).send({ message: err.message });
    } else if (err instanceof Errors.Unauthorized) {
        res.status(401).send({ message: err.message });
    } else if (err instanceof Errors.Forbidden) {
        res.status(403).send({ message: err.message });
    } else if (err instanceof Errors.NotFound) {
        res.status(404).send({ message: err.message });
    } else if (err instanceof Errors.UnprocessableEntity) {
        res.status(422).send({ message: err.message });
    } else if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
    } else {
        res.status(500).send({ error: err, message: err.message });
    }
};

module.exports = { errorHandlerMiddleware };
