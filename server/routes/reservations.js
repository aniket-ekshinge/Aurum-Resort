const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { rooms, roomBookings, diningReservations } = require('../data/store');
const { validate, asyncHandler } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

// POST /api/reservations/room
router.post('/room', authenticate, [
  body('roomId').isInt({ min: 1 }),
  body('checkIn').isISO8601(),
  body('checkOut').isISO8601(),
  body('guests').isInt({ min: 1, max: 8 }),
  body('guestName').trim().isLength({ min: 2 }),
  body('guestEmail').isEmail(),
], validate, asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, guests, guestName, guestEmail, specialRequests } = req.body;
  const room = rooms.find(r => r.id === Number(roomId));
  if (!room) return res.status(404).json({ success: false, error: 'Room not found.' });
  if (!room.available) return res.status(400).json({ success: false, error: 'This suite is not available.' });
  const d1 = new Date(checkIn), d2 = new Date(checkOut);
  if (d2 <= d1) return res.status(400).json({ success: false, error: 'Check-out must be after check-in.' });
  if (d1 < new Date(new Date().toDateString())) return res.status(400).json({ success: false, error: 'Check-in cannot be in the past.' });

  // Overlap check
  const overlap = roomBookings.find(b => b.roomId === Number(roomId) && b.status !== 'cancelled' && new Date(b.checkOut) > d1 && new Date(b.checkIn) < d2);
  if (overlap) return res.status(409).json({ success: false, error: `Suite already booked from ${overlap.checkIn} to ${overlap.checkOut}. Choose different dates.` });

  // Duplicate user booking
  const userRepeat = roomBookings.find(b => b.userId === req.user.id && b.roomId === Number(roomId) && b.status === 'confirmed');
  if (userRepeat) return res.status(409).json({ success: false, error: `You already have a confirmed booking for ${room.name} (${userRepeat.confirmationCode}). Cancel it before rebooking.` });

  const nights = Math.round((d2 - d1) / 86400000);
  const totalPrice = nights * room.pricePerNight;
  const pointsEarned = Math.round(totalPrice * 3);
  const booking = { id: uuidv4(), confirmationCode: 'AUR-' + Date.now().toString(36).toUpperCase(), roomId: room.id, roomName: room.name, checkIn, checkOut, nights, guests: Number(guests), guestName, guestEmail, userId: req.user.id, specialRequests: specialRequests || '', totalPrice, pointsEarned, status: 'confirmed', createdAt: new Date().toISOString() };
  roomBookings.push(booking);
  const store = require('../data/store');
  const u = store.users.find(u => u.id === req.user.id);
  if (u) u.loyaltyPoints += pointsEarned;
  res.status(201).json({ success: true, message: 'Suite reserved successfully.', data: { confirmationCode: booking.confirmationCode, roomName: booking.roomName, checkIn, checkOut, nights, totalPrice, pointsEarned } });
}));

// GET /api/reservations/room/my
router.get('/room/my', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: roomBookings.filter(b => b.userId === req.user.id) });
}));

// GET /api/reservations/room — admin only
router.get('/room', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only.' });
  res.json({ success: true, count: roomBookings.length, data: roomBookings });
}));

// POST /api/reservations/dining
router.post('/dining', authenticate, [
  body('date').isISO8601(),
  body('time').notEmpty(),
  body('tableNumber').isInt({ min: 1, max: 20 }),
  body('guestName').trim().isLength({ min: 2 }),
  body('guestEmail').isEmail(),
  body('partySize').isInt({ min: 1, max: 12 }),
], validate, asyncHandler(async (req, res) => {
  const { date, time, tableNumber, guestName, guestEmail, partySize, specialRequests } = req.body;
  const conflict = diningReservations.find(r => r.date === date && r.time === time && r.tableNumber === Number(tableNumber) && r.status !== 'cancelled');
  if (conflict) return res.status(409).json({ success: false, error: 'This table is already reserved at that time.' });
  const userConflict = diningReservations.find(r => r.userId === req.user.id && r.date === date && r.time === time && r.status !== 'cancelled');
  if (userConflict) return res.status(409).json({ success: false, error: `You already have a reservation at ${time} on ${date}.` });
  const reservation = { id: uuidv4(), confirmationCode: 'DIN-' + Date.now().toString(36).toUpperCase(), date, time, tableNumber: Number(tableNumber), guestName, guestEmail, partySize: Number(partySize), userId: req.user.id, specialRequests: specialRequests || '', status: 'confirmed', createdAt: new Date().toISOString() };
  diningReservations.push(reservation);
  res.status(201).json({ success: true, message: 'Table reserved.', data: { confirmationCode: reservation.confirmationCode, date, time, tableNumber: reservation.tableNumber, partySize: reservation.partySize } });
}));

// GET /api/reservations/dining/my
router.get('/dining/my', authenticate, asyncHandler(async (req, res) => {
  res.json({ success: true, data: diningReservations.filter(r => r.userId === req.user.id) });
}));

// GET /api/reservations/dining — admin only
router.get('/dining', authenticate, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only.' });
  const { date } = req.query;
  const result = date ? diningReservations.filter(r => r.date === date) : diningReservations;
  res.json({ success: true, count: result.length, data: result });
}));

// DELETE /api/reservations/:id
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rIdx = roomBookings.findIndex(b => b.id === id);
  const dIdx = diningReservations.findIndex(r => r.id === id);
  if (rIdx === -1 && dIdx === -1) return res.status(404).json({ success: false, error: 'Reservation not found.' });
  const list = rIdx !== -1 ? roomBookings : diningReservations;
  const idx = rIdx !== -1 ? rIdx : dIdx;
  if (list[idx].userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Cannot cancel other users reservations.' });
  list[idx].status = 'cancelled';
  res.json({ success: true, message: 'Reservation cancelled.' });
}));

module.exports = router;
