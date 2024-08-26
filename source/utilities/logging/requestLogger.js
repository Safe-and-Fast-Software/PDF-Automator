/**
 * Middleware that logs events.
 */
function requestLogger(request, responds, next) {

    const currentTime = new Date().toUTCString();
    const ip = (request.headers['x-forwarded-for'] || request.socket.remoteAddress);
    const name = (request.user&&request.user.name?`${request.user.name}`:"an unknown user");

    console.info(
        `On ${currentTime} a ${request.method} request was made for ${request.url} by ${name} at ip-address: ${ip}.`
    );
    
    if (request.body !== undefined) console.debug('Request body:', request.body);
    // console.debug('Request headers:', request.headers);

    return next();
}

export default requestLogger;