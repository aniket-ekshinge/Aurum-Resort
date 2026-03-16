const express = require('express');
const router = express.Router();
const { rooms, roomBookings, diningReservations, users, menuItems } = require('../data/store');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats — dashboard summary
router.get('/stats', asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = roomBookings.filter(b => b.status === 'confirmed');
  const todayDining = diningReservations.filter(r => r.date === today && r.status === 'confirmed');
  const totalRevenue = roomBookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalPrice, 0);
  const occupancyRate = Math.round((activeBookings.length / rooms.length) * 100);
  const guestUsers = users.filter(u => u.role === 'guest');

  res.json({
    success: true,
    data: {
      totalRoomBookings: roomBookings.length,
      activeBookings: activeBookings.length,
      cancelledBookings: roomBookings.filter(b => b.status === 'cancelled').length,
      totalDiningReservations: diningReservations.length,
      todayDiningReservations: todayDining.length,
      totalRevenue,
      occupancyRate,
      totalGuests: guestUsers.length,
      availableRooms: rooms.filter(r => r.available).length,
      totalRooms: rooms.length,
    }
  });
}));

// GET /api/admin/bookings — all room bookings with filters
router.get('/bookings', asyncHandler(async (req, res) => {
  const { status, roomId, search } = req.query;
  let result = [...roomBookings];
  if (status) result = result.filter(b => b.status === status);
  if (roomId) result = result.filter(b => b.roomId === Number(roomId));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(b => b.guestName.toLowerCase().includes(q) || b.guestEmail.toLowerCase().includes(q) || b.confirmationCode.toLowerCase().includes(q));
  }
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: result.length, data: result });
}));

// PATCH /api/admin/bookings/:id/status
router.patch('/bookings/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['confirmed', 'cancelled', 'completed', 'no-show'];
  if (!allowed.includes(status)) return res.status(400).json({ success: false, error: `Status must be one of: ${allowed.join(', ')}` });
  const idx = roomBookings.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Booking not found.' });
  roomBookings[idx].status = status;
  res.json({ success: true, message: `Booking status updated to ${status}.`, data: roomBookings[idx] });
}));

// GET /api/admin/dining — all dining reservations
router.get('/dining', asyncHandler(async (req, res) => {
  const { date, status } = req.query;
  let result = [...diningReservations];
  if (date) result = result.filter(r => r.date === date);
  if (status) result = result.filter(r => r.status === status);
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: result.length, data: result });
}));

// PATCH /api/admin/dining/:id/status
router.patch('/dining/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const idx = diningReservations.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Reservation not found.' });
  diningReservations[idx].status = status;
  res.json({ success: true, message: `Reservation status updated.`, data: diningReservations[idx] });
}));

// GET /api/admin/rooms — all rooms
router.get('/rooms', asyncHandler(async (req, res) => {
  res.json({ success: true, count: rooms.length, data: rooms });
}));

// PATCH /api/admin/rooms/:id/availability
router.patch('/rooms/:id/availability', asyncHandler(async (req, res) => {
  const idx = rooms.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, error: 'Room not found.' });
  rooms[idx].available = req.body.available === true || req.body.available === 'true';
  res.json({ success: true, message: `Room availability updated.`, data: { id: rooms[idx].id, name: rooms[idx].name, available: rooms[idx].available } });
}));

// PATCH /api/admin/rooms/:id/price
router.patch('/rooms/:id/price', asyncHandler(async (req, res) => {
  const { pricePerNight } = req.body;
  if (!pricePerNight || pricePerNight < 0) return res.status(400).json({ success: false, error: 'Valid price required.' });
  const idx = rooms.findIndex(r => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, error: 'Room not found.' });
  rooms[idx].pricePerNight = Number(pricePerNight);
  res.json({ success: true, message: 'Room price updated.', data: { id: rooms[idx].id, pricePerNight: rooms[idx].pricePerNight } });
}));

// GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json({ success: true, count: safeUsers.length, data: safeUsers });
}));

// GET /api/admin/revenue — revenue breakdown by room
router.get('/revenue', asyncHandler(async (req, res) => {
  const byRoom = rooms.map(r => {
    const bookings = roomBookings.filter(b => b.roomId === r.id && b.status !== 'cancelled');
    const revenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
    return { roomId: r.id, roomName: r.name, bookings: bookings.length, revenue };
  });
  byRoom.sort((a, b) => b.revenue - a.revenue);
  res.json({ success: true, data: byRoom });
}));

module.exports = router;
