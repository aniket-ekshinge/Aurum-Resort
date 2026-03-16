const { sessions, users } = require('../data/store');

// Attach user to req if valid token present
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
  }
  const token = auth.slice(7);
  const userId = sessions[token];
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid. Please log in again.' });
  }
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found.' });
  }
  req.user = user;
  req.token = token;
  next();
}

// Optional auth — attaches user if token present, continues either way
function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const userId = sessions[token];
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) req.user = user;
    }
  }
  next();
}

// Require admin role
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Authentication required.' });
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin access required.' });
  next();
}

module.exports = { authenticate, optionalAuth, requireAdmin };
