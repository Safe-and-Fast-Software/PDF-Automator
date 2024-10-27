
/**
 * Handles an error that occurred that was uncaught, and sends the user a friendlier message.
 */
export default function handleError(error, request, responds, next) {

  console.error(
    `A ${request.method} method for ${request.url} failed with the following error:`, 
    error.message,
    error
  );

  const respondsCode = error.status || 500
  responds.status(respondsCode).json({
    error: {
      error: error.message || 'Internal Server Error',
      status: respondsCode,
    }
  });

  return next();
}
