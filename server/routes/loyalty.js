const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { loyaltyMember, perks } = require('../data/store');
const { validate, asyncHandler } = require('../middleware/errorHandler');

// GET /api/loyalty/member — get member profile
router.get('/member', asyncHandler(async (req, res) => {
  res.json({ success: true, data: loyaltyMember });
}));

// GET /api/loyalty/perks — all member perks
router.get('/perks', asyncHandler(async (req, res) => {
  const { tier } = req.query;
  let result = [...perks];
  if (tier) result = result.filter(p => p.tier.toLowerCase() === tier.toLowerCase());
  res.json({ success: true, count: result.length, data: result });
}));

// POST /api/loyalty/redeem — redeem points
router.post('/redeem', [
  body('points').isInt({ min: 500 }).withMessage('Minimum redemption is 500 points'),
], validate, asyncHandler(async (req, res) => {
  const { points } = req.body;
  if (loyaltyMember.points < points) {
    return res.status(400).json({ success: false, error: `Insufficient points. You have ${loyaltyMember.points} points.` });
  }

  loyaltyMember.points -= points;
  loyaltyMember.totalRedeemed += points;
  const cashValue = Math.round(points * 0.01);

  res.json({
    success: true,
    message: `${points} points redeemed for $${cashValue} resort credit`,
    data: { pointsRedeemed: points, cashValue, remainingPoints: loyaltyMember.points }
  });
}));

// GET /api/loyalty/simulate — calculate points for a potential booking
router.get('/simulate', asyncHandler(async (req, res) => {
  const { rate, nights } = req.query;
  if (!rate || !nights) return res.status(400).json({ success: false, error: 'rate and nights query params required' });

  const totalSpend = Number(rate) * Number(nights);
  const pointsEarned = Math.round(totalSpend * 3);
  const pointsValue = Math.round(pointsEarned * 0.01);

  res.json({ success: true, data: { rate: Number(rate), nights: Number(nights), totalSpend, pointsEarned, pointsValue } });
}));

module.exports = router;
