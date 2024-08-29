const { StatusCodes } = require('http-status-codes');
const ResponseError = require('./response-error');
const Unauthorized = require('./unauthorized');

class Unauthenticated extends ResponseError {
    constructor(message) {
        super(message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = Unauthenticated;