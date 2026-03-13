# 🏝️ Aurum Resort — Full-Stack Hotel Booking Platform

> **Ultra-luxury 5-star hotel & restaurant website** built as a portfolio showcase project demonstrating full-stack React + Node.js skills with real-world architecture patterns.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, CSS Modules, Framer Motion |
| **Backend** | Node.js, Express.js, REST API |
| **State** | Custom React Hooks, Context API |
| **HTTP Client** | Axios with interceptors |
| **Validation** | express-validator |
| **Security** | Helmet, CORS, Rate Limiting |
| **UX** | React Hot Toast, React Helmet Async |
| **Fonts** | Playfair Display, Cormorant Garamond, Montserrat |

---

## 📁 Project Structure

```
aurum-resort/
├── package.json              # Root workspace config (concurrently)
├── README.md
│
├── server/                   # Node.js + Express REST API
│   ├── index.js              # Entry point, middleware setup
│   ├── .env.example
│   ├── data/
│   │   └── store.js          # In-memory data store (rooms, menu, bookings)
│   ├── middleware/
│   │   └── errorHandler.js   # Validation & async error handling
│   └── routes/
│       ├── rooms.js          # GET /api/rooms, GET /api/rooms/:id
│       ├── reservations.js   # POST /api/reservations/room & /dining
│       ├── menu.js           # GET /api/menu/:category
│       ├── loyalty.js        # GET/POST /api/loyalty
│       └── availability.js   # GET /api/availability/rooms & /dining
│
└── client/                   # React 18 SPA
    ├── public/index.html
    ├── package.json
    └── src/
        ├── App.jsx            # Route definitions (React Router v6)
        ├── index.js           # ReactDOM.createRoot, Toaster
        ├── index.css          # Global design tokens & utility classes
        ├── utils/
        │   └── api.js         # Axios instance + all API service fns
        ├── hooks/
        │   └── index.js       # useRooms, useRoom, useMenu, useLoyalty, useAvailability
        ├── components/
        │   ├── layout/
        │   │   ├── Layout.jsx        # Outlet wrapper
        │   │   ├── Navbar.jsx        # Sticky nav with active NavLinks
        │   │   └── Footer.jsx
        │   ├── rooms/
        │   │   ├── RoomCard.jsx      # Card with hover tour preview
        │   │   ├── BookingForm.jsx   # Full booking form → API → confirmation
        │   │   └── VirtualTour.jsx   # Interactive drag panorama with hotspots
        │   ├── dining/
        │   │   └── DiningReservationPanel.jsx  # Table grid + time slots
        │   └── ui/
        │       └── ChatWidget.jsx    # Floating AI concierge chat
        └── pages/
            ├── HomePage.jsx          # Hero, availability bar, highlights
            ├── RoomsPage.jsx         # Filterable grid + virtual tour
            ├── RoomDetailPage.jsx    # Full room info + sticky booking panel
            ├── DiningPage.jsx        # Menu tabs + reservation panel
            ├── LoyaltyPage.jsx       # Member card, simulator, history, perks
            ├── ExperiencePage.jsx    # Hotel experiences showcase
            └── NotFoundPage.jsx      # Custom 404
```

---

## ✨ Features

### 🏨 Room Booking System
- Real-time availability check via REST API
- Full booking form with validation
- Night calculation, total pricing, loyalty points preview
- Confirmation screen with booking code
- Sold-out states, filter by availability/price/guests

### 🎬 Interactive Virtual Tour
- Draggable 360° panorama (mouse drag interaction)
- 4 unique room spaces with animated hotspots
- Auto-play mode, manual navigation
- Smooth transitions between rooms

### 🍽️ Fine Dining Reservation
- 4-category live menu (Tasting / À La Carte / Bar / Patisserie)
- 20-table interactive grid with real taken/free/selected states
- Time slot selection with unavailability handling
- POST to `/api/reservations/dining` → confirmation code

### 🌟 Loyalty Rewards Dashboard
- Member card with tier, live points counter
- Progress bar to next tier (Platinum → Diamond Elite)
- Interactive points simulator (rate × nights sliders)
- Booking history with points earned per stay
- Redeem flow with live API update

### 🔌 REST API (Node.js / Express)
- 5 route modules: rooms, reservations, menu, loyalty, availability
- Input validation with express-validator
- Rate limiting (200 req/15 min), Helmet security headers
- Structured JSON responses with success/error patterns
- In-memory store (swap for MongoDB/PostgreSQL in production)

### 💬 Concierge Chat
- Smart keyword detection (booking, spa, dining, rooms)
- Typing indicator animation
- Context-aware responses

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/aurum-resort.git
cd aurum-resort

# Install all dependencies (root + server + client)
npm run install:all
```

### Environment Setup

```bash
cd server
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

### Run in Development

```bash
# From project root — runs API (port 5000) + React (port 3000) concurrently
npm run dev
```

Visit: `http://localhost:3000`

API Health: `http://localhost:5000/api/health`

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/rooms` | All rooms (filter: available, price, guests) |
| `GET` | `/api/rooms/:id` | Single room by ID or slug |
| `GET` | `/api/rooms/:id/availability` | Availability calendar |
| `GET` | `/api/availability/rooms` | Check availability (checkIn, checkOut, guests) |
| `GET` | `/api/availability/dining` | Dining table availability for a date |
| `POST` | `/api/reservations/room` | Create room booking |
| `POST` | `/api/reservations/dining` | Create dining reservation |
| `DELETE` | `/api/reservations/:id` | Cancel reservation |
| `GET` | `/api/menu` | All menu items by category |
| `GET` | `/api/menu/:category` | Menu by category (tasting/alacarte/drinks/dessert) |
| `GET` | `/api/loyalty/member` | Member profile & history |
| `GET` | `/api/loyalty/perks` | Member perks |
| `POST` | `/api/loyalty/redeem` | Redeem points |
| `GET` | `/api/loyalty/simulate` | Simulate points for rate × nights |

---

## 🗺️ Pages & Routes

| Route | Page | Key Features |
|-------|------|-------------|
| `/` | Home | Hero, availability bar, highlights |
| `/rooms` | Rooms | Filterable grid, virtual tour |
| `/rooms/:id` | Room Detail | Full info, sticky booking form |
| `/dining` | Dining | Menu tabs, reservation panel |
| `/loyalty` | Loyalty | Member card, simulator, history |
| `/experience` | Experience | Experiences showcase |
| `*` | 404 | Custom not-found page |

---

## 🎨 Design System

- **Primary font**: Playfair Display (headings, prices, display)
- **Secondary font**: Cormorant Garamond (quotes, descriptions)
- **Body font**: Montserrat (UI, labels, buttons)
- **Colours**: `--gold: #C9A84C`, `--onyx: #0A0A0A`, `--cream: #F5F0E8`
- **Styling**: CSS Modules (scoped per component)
- **Animations**: CSS keyframes + hover transitions

---

## 🔮 Production Upgrades (Next Steps)

- [ ] Replace in-memory store with **MongoDB** (Mongoose) or **PostgreSQL** (Prisma)
- [ ] Add **JWT authentication** for protected routes
- [ ] **Stripe** payment integration for actual bookings
- [ ] **Cloudinary** for room image uploads
- [ ] **SendGrid** confirmation emails
- [ ] Deploy: **Vercel** (client) + **Railway** (server)
- [ ] Add **Admin dashboard** (manage rooms, view bookings)
- [ ] **React Query** for server state caching

---

## 👨‍💻 Author

Built as a portfolio showcase project demonstrating:
- Clean React architecture with custom hooks
- RESTful API design with Express.js
- Component-level CSS Modules
- Real API integration patterns
- Production-grade project structure

---

*Aurum Resort — where luxury meets eternity.*
