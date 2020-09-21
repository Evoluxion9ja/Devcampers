const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) =>
{
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    if (err.name === 'CastError') {
        const message = `Do you know that a mongodb ID doesn't look any way close to the request ID ${err.value}, Please make sure it is the correct ID format. Thank you`;
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const message = `It is only possible for you to create a resource with a name, any attempt to re-create that resource with the same name will result in 'Duplicate Nave Value'`;
        error = new ErrorResponse(message, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        response: `Hey! Please be calm, we noticed you are having a problem trying to get a response and we are working tirelessly to get it fixed, please try again later or reload the page`,
        error: error.message || `You have encountered a server error which we are working on currently`
    })
}

module.exports = errorHandler;