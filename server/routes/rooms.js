const express = require('express');
const router = express.Router();
const { rooms } = require('../data/store');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/rooms — list all rooms with optional filters
router.get('/', asyncHandler(async (req, res) => {
  const { available, maxPrice, minPrice, guests, tier } = req.query;
  let result = [...rooms];

  if (available === 'true') result = result.filter(r => r.available);
  if (minPrice) result = result.filter(r => r.pricePerNight >= Number(minPrice));
  if (maxPrice) result = result.filter(r => r.pricePerNight <= Number(maxPrice));
  if (guests) result = result.filter(r => r.maxGuests >= Number(guests));
  if (tier) result = result.filter(r => r.tier.toLowerCase().includes(tier.toLowerCase()));

  res.json({ success: true, count: result.length, data: result });
}));

// GET /api/rooms/:id — get single room by id or slug
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = isNaN(id)
    ? rooms.find(r => r.slug === id)
    : rooms.find(r => r.id === Number(id));

  if (!room) return res.status(404).json({ success: false, error: 'Room not found' });
  res.json({ success: true, data: room });
}));

// GET /api/rooms/:id/availability — availability calendar
router.get('/:id/availability', asyncHandler(async (req, res) => {
  const room = rooms.find(r => r.id === Number(req.params.id));
  if (!room) return res.status(404).json({ success: false, error: 'Room not found' });

  // Mock blocked dates for demo
  const today = new Date();
  const blockedDates = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + Math.floor(Math.random() * 60) + 5);
    return d.toISOString().split('T')[0];
  });

  res.json({ success: true, data: { roomId: room.id, available: room.available, blockedDates: [...new Set(blockedDates)] } });
}));

module.exports = router;
