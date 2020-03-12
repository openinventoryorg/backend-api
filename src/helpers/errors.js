/* eslint-disable max-classes-per-file */
class ExtendableError extends Error {
    /**
     * The abstract class for all handled error: 400, 401, 403, 404, 500
     * @param  {string} message Error message
     * @constructor
     */
    constructor(message) {
        if (new.target === ExtendableError) {
            throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
        }
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.contructor);
    }
}

class BadRequest extends ExtendableError {
    /**
     * Error class for 400: Bad Request
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('bad request');
        } else {
            super(m);
        }
    }
}

class Unauthorized extends ExtendableError {
    /**
     * Error class for 401: Unauthorized
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('unauthorized');
        } else {
            super(m);
        }
    }
}

class Forbidden extends ExtendableError {
    /**
     * Error class for 403: Forbidden
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('forbidden');
        } else {
            super(m);
        }
    }
}

class NotFound extends ExtendableError {
    /**
     * Error class for 404: Not Found
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('not found');
        } else {
            super(m);
        }
    }
}

class Conflict extends ExtendableError {
    /**
     * Error class for 409: Conflict
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('conflict');
        } else {
            super(m);
        }
    }
}

class UnprocessableEntity extends ExtendableError {
    /**
     * Error class for 422: Unprocessable Entity
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('unprocessable entity');
        } else {
            super(m);
        }
    }
}

class InternalServerError extends ExtendableError {
    /**
     * Error class for 500: Internal Server Error
     * @param  {string} m Error message
     * @constructor
     */
    constructor(m) {
        if (arguments.length === 0) {
            super('internal server error');
        } else {
            super(m);
        }
    }
}


module.exports.BadRequest = BadRequest;
module.exports.Unauthorized = Unauthorized;
module.exports.Forbidden = Forbidden;
module.exports.NotFound = NotFound;
module.exports.Conflict = Conflict;
module.exports.UnprocessableEntity = UnprocessableEntity;
module.exports.InternalServerError = InternalServerError;
