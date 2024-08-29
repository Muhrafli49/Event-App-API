const { StatusCodes } = require('http-status-codes');
const ResponseError = require ('./response-error');

class Unauthorized extends ResponseError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = Unauthorized;
