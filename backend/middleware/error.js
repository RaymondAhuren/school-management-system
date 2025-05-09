function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id: ${err.value}`;
  }

  // JWT errors (if you use JWT for auth)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export default errorHandler;
