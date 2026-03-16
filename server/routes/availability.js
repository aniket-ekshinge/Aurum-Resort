const express = require('express');
const router = express.Router();
const { rooms, diningReservations } = require('../data/store');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/rooms', asyncHandler(async (req, res) => {
  const { checkIn, checkOut, guests, roomType } = req.query;
  if (!checkIn || !checkOut) return res.status(400).json({ success: false, error: 'checkIn and checkOut required' });
  const d1 = new Date(checkIn), d2 = new Date(checkOut);
  if (isNaN(d1) || isNaN(d2) || d2 <= d1) return res.status(400).json({ success: false, error: 'Invalid dates' });
  const nights = Math.round((d2 - d1) / 86400000);
  let available = rooms.filter(r => r.available);
  if (guests) available = available.filter(r => r.maxGuests >= Number(guests));
  if (roomType) available = available.filter(r => r.name.toLowerCase().includes(roomType.toLowerCase()) || r.tier.toLowerCase().includes(roomType.toLowerCase()));
  const result = available.map(r => ({ id: r.id, name: r.name, tier: r.tier, pricePerNight: r.pricePerNight, totalPrice: r.pricePerNight * nights, nights, maxGuests: r.maxGuests, view: r.view, size: r.size }));
  res.json({ success: true, nights, count: result.length, data: result });
}));

router.get('/dining', asyncHandler(async (req, res) => {
  const { date } = req.query;
  const allTimes = ['7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'];
  const allTables = Array.from({ length: 20 }, (_, i) => ({ number: i + 1, seats: i < 5 ? 2 : i < 15 ? 4 : 6 }));
  if (!date) return res.json({ success: true, data: { times: allTimes, tables: allTables.map(t => ({ ...t, available: true })) } });
  const reserved = diningReservations.filter(r => r.date === date && r.status !== 'cancelled');
  const reservedPairs = reserved.map(r => `${r.time}-${r.tableNumber}`);
  const timesWithAvail = allTimes.map(time => {
    const tablesAtTime = allTables.filter(t => !reservedPairs.includes(`${time}-${t.number}`));
    return { time, availableCount: tablesAtTime.length, available: tablesAtTime.length > 0 };
  });
  const tablesWithAvail = allTables.map(table => {
    const reservedTimes = reserved.filter(r => r.tableNumber === table.number).map(r => r.time);
    return { ...table, reservedTimes, available: reservedTimes.length < allTimes.length, takenBy: reserved.filter(r => r.tableNumber === table.number).map(r => ({ time: r.time, partySize: r.partySize })) };
  });
  res.json({ success: true, data: { date, times: timesWithAvail, tables: tablesWithAvail } });
}));

module.exports = router;
