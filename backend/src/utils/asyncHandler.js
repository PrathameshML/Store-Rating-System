/**
 * asyncHandler - wrapper to avoid repetitive try/catch in routes
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
