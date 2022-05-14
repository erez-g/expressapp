function errorMiddleware(error, request, response, next) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.error(error.stack);
    response
        .status(status)
        .send({
            success: false,
            status,
            message,
        });
}

module.exports = errorMiddleware;