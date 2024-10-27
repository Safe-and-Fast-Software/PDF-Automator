/**
 * Middleware that logs events.
 */
function requestLogger(request, responds, next) {

  /* Logging all interactions between the client and the server that isn't a health check*/ {
    if (request.originalUrl === "/health-check") return next();
    const currentTime = new Date().toUTCString();
    const ip = (request.headers['x-forwarded-for'] || request.socket.remoteAddress);
    const name = (request.user&&request.user.name?`${request.user.name}`:"an unknown user");
    console.info(
      `On ${currentTime} a ${request.method} request was made for ${request.url} by ${name} at ip-address: ${ip}.`
    );
  }
  
  if (request.body !== undefined) console.debug('Request body:', request.body);

  return next();
}

export default requestLogger;