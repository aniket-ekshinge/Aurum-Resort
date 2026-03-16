const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { users, sessions, hashPassword, checkPassword } = require('../data/store');
const { validate, asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

function safeUser(u) {
  const { password, ...safe } = u;
  return safe;
}

// POST /api/auth/register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashPassword(password),
    role: 'guest',
    loyaltyTier: 'Silver',
    loyaltyPoints: 500, // welcome bonus
    memberSince: new Date().getFullYear().toString(),
    cardId: `AUR-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  const token = uuidv4();
  sessions[token] = newUser.id;

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Welcome to Aurum Privileges!',
    data: { token, user: safeUser(newUser) }
  });
}));

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user || !checkPassword(password, user.password)) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const token = uuidv4();
  sessions[token] = user.id;

  res.json({
    success: true,
    message: `Welcome back, ${user.name.split(' ')[0]}!`,
    data: { token, user: safeUser(user) }
  });
}));

// POST /api/auth/logout
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  delete sessions[req.token];
  res.json({ success: true, message: 'Logged out successfully.' });
}));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: safeUser(req.user) });
}));

module.exports = router;
