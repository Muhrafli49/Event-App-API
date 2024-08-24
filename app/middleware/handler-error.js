const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
    let responseError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal Server Error',
    };

    if (err.name === 'ValidationError') {
        responseError.message = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
        responseError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        responseError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`;
        responseError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        responseError.message = `No item found with id : ${err.value}`;
        responseError.statusCode = 404;
    }

    return res.status(responseError.statusCode).json({
        message: responseError.message
    });
};

module.exports = errorHandlerMiddleware;