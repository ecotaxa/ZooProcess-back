// Error handling middleware
function errorHandler(err, req, res, next) {
    const statusCode = err.status || 500;
    
    // Create response object
    const errorResponse = {
      error: {
        name: err.name,
        message: err.message
      }
    };
    
    // Add url for DriveAccessException
    if (err.url) {
      errorResponse.error.url = err.url;
    }
    
    // Add stack trace in development or when explicitly requested
    if (process.env.NODE_ENV !== 'production' || req.query.debug === 'true') {
      errorResponse.error.stack = err.stack;
    }
    
    res.status(statusCode).json(errorResponse);
  }
  
  module.exports = errorHandler;
  