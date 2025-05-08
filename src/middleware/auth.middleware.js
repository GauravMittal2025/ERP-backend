const authMiddleware = {
  // Ensure user is authenticated
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized - Please log in' });
  },

  // Ensure user is not authenticated (for login/register routes)
  isNotAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.status(400).json({ message: 'Already authenticated' });
  }
};

module.exports = authMiddleware;