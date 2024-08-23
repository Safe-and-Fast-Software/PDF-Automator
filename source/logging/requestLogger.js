/**
 * Middleware that logs events.
 */
function requestLogger(request, responds, next) {

    const currentTime = new Date().toISOString();

    console.info(`[${currentTime}] ${request.method} ${request.url}`);
    console.debug(`[${currentTime}] ${request.method} ${request.url}`);
    console.debug('Headers:', request.headers);
    console.debug('Body:', request.body);

    return next();
}

export default requestLogger;