import logger from "./logs/logger.js";

/**
 * Middleware that logs events.
 */
function requestLogger(request, responds, next) {

    const currentTime = new Date().toISOString();

    logger.info(`[${currentTime}] ${request.method} ${request.url}`);
    logger.debug(`[${currentTime}] ${request.method} ${request.url}`);
    logger.debug('Headers:', request.headers);
    logger.debug('Body:', request.body);

    next();
}

export default requestLogger;