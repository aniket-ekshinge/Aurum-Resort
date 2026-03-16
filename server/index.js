require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const roomsRouter = require('./routes/rooms');
const reservationsRouter = require('./routes/reservations');
const menuRouter = require('./routes/menu');
const loyaltyRouter = require('./routes/loyalty');
const availabilityRouter = require('./routes/availability');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { error: 'Too many requests.' } });
app.use('/api/', limiter);

app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/menu', menuRouter);
app.use('/api/loyalty', loyaltyRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Aurum Resort API', version: '2.0.0', timestamp: new Date().toISOString() }));

app.use('*', (req, res) => res.status(404).json({ error: `Route ${req.originalUrl} not found` }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' }); });

app.listen(PORT, () => {
  console.log(`\n🏝️  Aurum Resort API v2.0 → http://localhost:${PORT}`);
  console.log(`🔐  Auth:  POST /api/auth/login  |  POST /api/auth/register`);
  console.log(`🔑  Demo:  admin@aurum.com / admin2024  |  alex@aurum.com / alex123`);
  console.log(`📊  Admin: GET  /api/admin/stats\n`);
});

module.exports = app;
