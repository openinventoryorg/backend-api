/**
 * This middleware avoids cors errors due to the same origin
 * Lets the backend server and the front end to be run in the same device
 * Should be removed in the production. use only for the development
 * @category Middlewares
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {NextFunction} next Next callback
 */
const corsErrorHandlerMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://openinventoryorg.github.io/web-frontend/#/');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

module.exports = { corsErrorHandlerMiddleware };
