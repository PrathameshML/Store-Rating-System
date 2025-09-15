/**
 * errorHandler.js
 * - Centralized error handling for express
 */
function errorHandler(err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  res.status(status).json({ success: false, message, details });
}

module.exports = { errorHandler };
