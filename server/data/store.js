const { v4: uuidv4 } = require('uuid');

const users = [
  { id: 'u1', name: 'Alexander Thornton', email: 'alex@aurum.com', password: '$aurum$hashed$alex123', role: 'guest', loyaltyTier: 'Platinum', loyaltyPoints: 24750, memberSince: '2019', cardId: 'AUR-1924-0047', createdAt: '2019-03-15T00:00:00Z' },
  { id: 'admin1', name: 'Isabella Moreau', email: 'admin@aurum.com', password: '$aurum$hashed$admin2024', role: 'admin', loyaltyTier: 'Staff', loyaltyPoints: 0, memberSince: '2020', cardId: 'AUR-STAFF-001', createdAt: '2020-01-01T00:00:00Z' }
];

const sessions = {};

const rooms = [
  { 
    id: 1,
    tier: 'Signature Collection',
    name: 'Overwater Bungalow',
    slug: 'overwater-bungalow',
    image: '/rooms/overwater-bungalow1.png',
    tourImage: '/tours/overwater-bungalow.png',
    shortDesc: 'Perched above the turquoise lagoon with direct ocean access.',
    description: 'Perched above the turquoise lagoon, these iconic bungalows offer direct access to the crystal-clear waters beneath.',
    pricePerNight: 1850,
    emoji: '🌊',
    bgColor: '#0A1520',
    size: '95 sqm',
    bedType: 'King',
    view: 'Direct Ocean',
    maxGuests: 2,
    available: true,
    amenities: ['Glass Floor Panel','Private Deck','Outdoor Shower','Sun Loungers'],
    fullAmenities: ['Glass floor panel with lagoon views','Private sundeck with direct ocean access','Outdoor rain shower','King-size bed with Egyptian cotton','Plunge pool','Dual vanity marble bathroom','Butler service','24hr room service','Complimentary minibar','Nespresso machine','Bang & Olufsen sound system','Smart home controls'],
    rating: 4.9,
    reviews: 248
  },

  { 
    id: 2,
    tier: 'Prestige Collection',
    name: 'Ocean Villa',
    slug: 'ocean-villa',
    image: '/rooms/ocean-villa1.png',
    tourImage: '/tours/ocean-villa.png',
    shortDesc: 'A private sanctuary with direct beach access and infinity pool.',
    description: 'A private sanctuary with direct beach access, surrounded by lush tropical gardens and the endless Indian Ocean horizon.',
    pricePerNight: 3200,
    emoji: '🏖️',
    bgColor: '#0F1A10',
    size: '240 sqm',
    bedType: 'King + Twin',
    view: 'Beach & Ocean',
    maxGuests: 4,
    available: true,
    amenities: ['Private Beach','Infinity Pool','Garden','Outdoor Dining'],
    fullAmenities: ['Private beach stretch','Heated infinity pool','Outdoor dining pavilion','Personal butler','Master bedroom + 1 guest room','Sunken living room','Outdoor shower garden','Yoga deck','Wine cellar','Personal buggy & driver','Snorkelling equipment','Complimentary spa treatment'],
    rating: 4.95,
    reviews: 182
  },

  { 
    id: 3,
    tier: 'Imperial Collection',
    name: 'Royal Penthouse',
    slug: 'royal-penthouse',
    image: '/rooms/royal-penthouse1.png',
    tourImage: '/tours/royal-penthouse.png',
    shortDesc: 'Three-floor private residence commanding 360° views of the atoll.',
    description: 'The pinnacle of island luxury. A sprawling three-floor residence commanding 360° views of the entire atoll.',
    pricePerNight: 8900,
    emoji: '👑',
    bgColor: '#1A0F05',
    size: '850 sqm',
    bedType: '3 × King',
    view: '360° Atoll',
    maxGuests: 6,
    available: false,
    amenities: ['3 Floors','360° Views','Private Chef','Helipad'],
    fullAmenities: ['3-floor private residence','360° panoramic atoll views','Dedicated private chef','Helicopter pad access','3 master bedrooms','Private cinema','Full-size tennis court','Rooftop infinity pool','Rolls-Royce transfer','Personal security team','Private spa suite','Underwater bedroom option'],
    rating: 5.0,
    reviews: 64
  },

  { 
    id: 4,
    tier: 'Garden Collection',
    name: 'Jungle Retreat',
    slug: 'jungle-retreat',
    image: '/rooms/jungle-retreat1.png',
    tourImage: '/tours/jungle-retreat.png',
    shortDesc: 'Treehouse-inspired villa with wraparound tropical forest views.',
    description: "Immerse yourself in the island's verdant heart. A treehouse-inspired villa with wraparound jungle views.",
    pricePerNight: 1250,
    emoji: '🌿',
    bgColor: '#051205',
    size: '140 sqm',
    bedType: 'King',
    view: 'Tropical Forest',
    maxGuests: 2,
    available: true,
    amenities: ['Treehouse Style','Forest Bath','Yoga Deck','Bird Sanctuary'],
    fullAmenities: ['Elevated treehouse design','Private forest bathing area','Morning yoga deck','Birdwatching tower','King canopy bed','Organic minibar','Natural fibre furnishings','Outdoor bathtub','Hammock garden','Nature guide service','Sunrise meditation sessions','Herbal garden'],
    rating: 4.85,
    reviews: 139
  },

  { 
    id: 5,
    tier: 'Sunset Collection',
    name: 'Sunset Suite',
    slug: 'sunset-suite',
    image: '/rooms/sunset-suite1.png',
    tourImage: '/tours/sunset-suite.png',
    shortDesc: 'West-facing sanctuary with the most breathtaking sunset panoramas.',
    description: 'Strategically positioned on the western tip of the island, offering the most breathtaking sunset panoramas.',
    pricePerNight: 2400,
    emoji: '🌅',
    bgColor: '#1A0A00',
    size: '320 sqm',
    bedType: 'Emperor',
    view: 'Horizon Sunset',
    maxGuests: 2,
    available: true,
    amenities: ['West Facing','Champagne Service','Sky Lounge','Private Chef'],
    fullAmenities: ['West-facing sunset position','Complimentary champagne at sundown','Private sky lounge','Personal chef for breakfast','Master bedroom + lounge','Roof terrace pool','Telescope observatory','Stargazing programme','Sunset butler','Monogrammed amenities','Daily floral arrangement','Sunset picnic service'],
    rating: 4.92,
    reviews: 211
  },

  { 
    id: 6,
    tier: 'Family Collection',
    name: 'Family Island Villa',
    slug: 'family-island-villa',
    image: '/rooms/family-island-villa1.png',
    tourImage: '/tours/family-island-villa.png',
    shortDesc: 'Two connected beach villas designed for families seeking freedom.',
    description: 'Spanning two private beach villas connected by a garden walkway. Designed for families seeking absolute freedom.',
    pricePerNight: 4600,
    emoji: '🏡',
    bgColor: '#0A0A1A',
    size: '520 sqm',
    bedType: '4 Bedrooms',
    view: 'Beach & Lagoon',
    maxGuests: 8,
    available: true,
    amenities: ['2 Villas','Kids Zone','Family Pool','Nanny Service'],
    fullAmenities: ['2 interconnected beach villas','Dedicated kids activity zone','Family infinity pool','24hr professional nanny','4 bedrooms total','Home cinema room','Kids dining menu','Underwater explorer kit','Family buggy','Babysitting included','Kids spa treatments','Adventure programme'],
    rating: 4.88,
    reviews: 97
  }
];

const roomBookings = [
  { id: uuidv4(), confirmationCode: 'AUR-DEMO001', roomId: 2, roomName: 'Ocean Villa', checkIn: '2025-04-10', checkOut: '2025-04-15', nights: 5, guests: 2, guestName: 'Alexander Thornton', guestEmail: 'alex@aurum.com', userId: 'u1', totalPrice: 16000, pointsEarned: 48000, status: 'confirmed', createdAt: '2025-03-01T10:00:00Z' },
  { id: uuidv4(), confirmationCode: 'AUR-DEMO002', roomId: 5, roomName: 'Sunset Suite', checkIn: '2025-02-14', checkOut: '2025-02-17', nights: 3, guests: 2, guestName: 'James Fletcher', guestEmail: 'james@example.com', userId: null, totalPrice: 7200, pointsEarned: 21600, status: 'confirmed', createdAt: '2025-01-20T14:30:00Z' },
  { id: uuidv4(), confirmationCode: 'AUR-DEMO003', roomId: 1, roomName: 'Overwater Bungalow', checkIn: '2025-01-05', checkOut: '2025-01-12', nights: 7, guests: 2, guestName: 'Maria Rossi', guestEmail: 'maria@example.com', userId: null, totalPrice: 12950, pointsEarned: 38850, status: 'completed', createdAt: '2024-12-10T09:00:00Z' }
];

const diningReservations = [
  { id: uuidv4(), confirmationCode: 'DIN-DEMO001', date: new Date().toISOString().split('T')[0], time: '8:00 PM', tableNumber: 3, guestName: 'Maria Rossi', guestEmail: 'maria@example.com', partySize: 2, userId: null, status: 'confirmed', createdAt: new Date().toISOString() },
  { id: uuidv4(), confirmationCode: 'DIN-DEMO002', date: new Date().toISOString().split('T')[0], time: '7:30 PM', tableNumber: 7, guestName: 'James Fletcher', guestEmail: 'james@example.com', partySize: 4, userId: null, status: 'confirmed', createdAt: new Date().toISOString() },
  { id: uuidv4(), confirmationCode: 'DIN-DEMO003', date: new Date().toISOString().split('T')[0], time: '9:00 PM', tableNumber: 12, guestName: 'Sophie Laurent', guestEmail: 'sophie@example.com', partySize: 2, userId: null, status: 'confirmed', createdAt: new Date().toISOString() }
];

const menuItems = {
  tasting: [
    { id: 't1', name: 'Amuse-Bouche Trio', description: 'Pani puri with truffle water, beetroot tikki with caviar, saffron golgappa shot', price: 52, tags: ['signature'], course: 'Starter' },
    { id: 't2', name: 'Shorba-e-Zafran', description: 'Royal saffron broth, hand-picked Kashmiri saffron, slow-roasted tomato, micro coriander', price: 68, tags: ['signature', 'vegetarian'], course: 'Soup' },
    { id: 't3', name: 'Raan-e-Aurum', description: '72-hour slow-braised lamb leg, aged dum masala, black cardamom jus, saffron mash', price: 210, tags: ['signature'], course: 'Main' },
    { id: 't4', name: 'Tandoori Lobster', description: 'Maldivian cold-water lobster, ajwain butter, pickled cucumber, smoked tomato chutney', price: 185, tags: ['signature', 'spiced'], course: 'Sharing' },
    { id: 't5', name: 'Dal Aurum', description: 'Black lentils slow-cooked 48 hours, Amul white butter, truffle oil, gold leaf finish', price: 95, tags: ['signature', 'vegetarian'], course: 'Main' }
  ],
  alacarte: [
    { id: 'a1', name: 'Burrah Lamb Chops', description: 'Himalayan lamb, raw papaya marinade, coal-fired tandoor, mint and green chilli relish', price: 145, tags: ['signature'], course: 'Starter' },
    { id: 'a2', name: 'Paneer Malai Tikka', description: 'Hung curd marinated cottage cheese, cardamom cream, rose petal chutney, edible gold', price: 58, tags: ['vegetarian', 'signature'], course: 'Starter' },
    { id: 'a3', name: 'Coastal Prawn Moilee', description: 'Tiger prawns in Kerala coconut milk, curry leaf oil, appam, pickled raw mango', price: 115, tags: ['signature', 'spiced'], course: 'Main' },
    { id: 'a4', name: 'Subz Dum Biryani', description: 'Aged basmati, seasonal heirloom vegetables, sealed in dough, rose water, crispy onions', price: 88, tags: ['vegetarian'], course: 'Main' },
    { id: 'a5', name: 'Murgh Makhani Royale', description: 'Free-range chicken, 24-hour tomato reduction, Amul butter, fenugreek, house-baked naan', price: 125, tags: [], course: 'Main' }
  ],
  drinks: [
    { id: 'd1', name: 'Aurum Chai Sour', description: 'Darjeeling first flush tea-washed whisky, cardamom syrup, lemon, egg white foam', price: 72, tags: ['signature'], course: 'Cocktail' },
    { id: 'd2', name: 'Royal Lassi', description: 'Thick Amul curd, Alphonso mango, saffron, cardamom, rose water, silver leaf', price: 35, tags: ['vegetarian', 'non-alcoholic', 'signature'], course: 'Mocktail' },
    { id: 'd3', name: 'Paan Martini', description: 'Grey Goose vodka, betel leaf extract, gulkand, white chocolate, edible silver', price: 78, tags: ['signature'], course: 'Cocktail' },
    { id: 'd4', name: 'Thandai Colada', description: 'Almonds, rose petals, fennel, poppy seed, coconut cream, crushed ice, silver dust', price: 38, tags: ['vegetarian', 'non-alcoholic'], course: 'Mocktail' },
    { id: 'd5', name: 'Single Malt Amrut', description: 'Amrut Fusion single malt, 8-year aged, notes of tropical fruit, oak, dark spice', price: 95, tags: ['signature'], course: 'Whisky' }
  ],
  dessert: [
    { id: 'ds1', name: 'Gulab Jamun Soufflé', description: 'Warm rose and cardamom soufflé, rabri ice cream, pistachio crumble, gold leaf', price: 55, tags: ['signature', 'vegetarian'], course: 'Dessert' },
    { id: 'ds2', name: 'Mango Shrikhand Dome', description: 'Alphonso mango sphere, hung curd mousse, saffron gel, almond praline, rose dust', price: 48, tags: ['vegetarian', 'signature'], course: 'Dessert' },
    { id: 'ds3', name: 'Mithai Trolley', description: '18 handcrafted Indian sweets — kaju katli, mohanthal, besan ladoo, motichoor, peda', price: 75, tags: ['vegetarian', 'signature'], course: 'Sharing' },
    { id: 'ds4', name: 'Kulfi Brûlée', description: 'Malai kulfi custard, jaggery caramel crust, rose petal jam, crushed pistachios', price: 42, tags: ['vegetarian'], course: 'Dessert' }
  ]
};

const perks = [
  { id: 1, icon: '🍾', name: 'Arrival Champagne', description: 'Moët & Chandon Rosé on arrival, every visit', tier: 'Gold' },
  { id: 2, icon: '✈️', name: 'Seaplane Transfer', description: 'Complimentary private seaplane from Malé', tier: 'Platinum' },
  { id: 3, icon: '💆', name: 'Daily Spa Credit', description: '$200 spa credit per night for treatments', tier: 'Platinum' },
  { id: 4, icon: '🏷️', name: 'Best Rate Guarantee', description: 'Always the lowest published rate, guaranteed', tier: 'Silver' },
  { id: 5, icon: '⬆️', name: 'Suite Upgrades', description: 'Complimentary upgrades subject to availability', tier: 'Gold' },
  { id: 6, icon: '🍽️', name: "Private Dining", description: "Exclusive Chef's Table on request", tier: 'Platinum' },
  { id: 7, icon: '🚤', name: 'Yacht Charter', description: '4hr private sunset yacht cruise per stay', tier: 'Diamond' },
  { id: 8, icon: '🌙', name: 'Late Checkout', description: 'Guaranteed 4pm late checkout, always', tier: 'Gold' }
];

function hashPassword(plain) { return '$aurum$hashed$' + plain; }
function checkPassword(plain, hashed) { return hashPassword(plain) === hashed; }

module.exports = { users, sessions, rooms, roomBookings, diningReservations, menuItems, perks, hashPassword, checkPassword };
