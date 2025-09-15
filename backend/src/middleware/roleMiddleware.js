/**
 * roleMiddleware.js
 * - Usage:
 *    router.use(authMiddleware, roleMiddleware('SYSTEM_ADMIN'))
 *    or roleMiddleware(['SYSTEM_ADMIN','STORE_OWNER'])
 */
module.exports = function roleMiddleware(roles) {
  if (!Array.isArray(roles)) roles = [roles];
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
