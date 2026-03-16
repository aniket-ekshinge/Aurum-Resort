const { v4: uuidv4 } = require('uuid');

const users = [
  { id: 'u1', name: 'Alexander Thornton', email: 'alex@aurum.com', password: '$aurum$hashed$alex123', role: 'guest', loyaltyTier: 'Platinum', loyaltyPoints: 24750, memberSince: '2019', cardId: 'AUR-1924-0047', createdAt: '2019-03-15T00:00:00Z' },
  { id: 'admin1', name: 'Isabella Moreau', email: 'admin@aurum.com', password: '$aurum$hashed$admin2024', role: 'admin', loyaltyTier: 'Staff', loyaltyPoints: 0, memberSince: '2020', cardId: 'AUR-STAFF-001', createdAt: '2020-01-01T00:00:00Z' }
];

const sessions = {};

const rooms = [
  { id: 1, tier: 'Signature Collection', name: 'Overwater Bungalow', slug: 'overwater-bungalow', shortDesc: 'Perched above the turquoise lagoon with direct ocean access.', description: 'Perched above the turquoise lagoon, these iconic bungalows offer direct access to the crystal-clear waters beneath.', pricePerNight: 1850, emoji: '🌊', bgColor: '#0A1520', size: '95 sqm', bedType: 'King', view: 'Direct Ocean', maxGuests: 2, available: true, amenities: ['Glass Floor Panel','Private Deck','Outdoor Shower','Sun Loungers'], fullAmenities: ['Glass floor panel with lagoon views','Private sundeck with direct ocean access','Outdoor rain shower','King-size bed with Egyptian cotton','Plunge pool','Dual vanity marble bathroom','Butler service','24hr room service','Complimentary minibar','Nespresso machine','Bang & Olufsen sound system','Smart home controls'], rating: 4.9, reviews: 248 },
  { id: 2, tier: 'Prestige Collection', name: 'Ocean Villa', slug: 'ocean-villa', shortDesc: 'A private sanctuary with direct beach access and infinity pool.', description: 'A private sanctuary with direct beach access, surrounded by lush tropical gardens and the endless Indian Ocean horizon.', pricePerNight: 3200, emoji: '🏖️', bgColor: '#0F1A10', size: '240 sqm', bedType: 'King + Twin', view: 'Beach & Ocean', maxGuests: 4, available: true, amenities: ['Private Beach','Infinity Pool','Garden','Outdoor Dining'], fullAmenities: ['Private beach stretch','Heated infinity pool','Outdoor dining pavilion','Personal butler','Master bedroom + 1 guest room','Sunken living room','Outdoor shower garden','Yoga deck','Wine cellar','Personal buggy & driver','Snorkelling equipment','Complimentary spa treatment'], rating: 4.95, reviews: 182 },
  { id: 3, tier: 'Imperial Collection', name: 'Royal Penthouse', slug: 'royal-penthouse', shortDesc: 'Three-floor private residence commanding 360° views of the atoll.', description: 'The pinnacle of island luxury. A sprawling three-floor residence commanding 360° views of the entire atoll.', pricePerNight: 8900, emoji: '👑', bgColor: '#1A0F05', size: '850 sqm', bedType: '3 × King', view: '360° Atoll', maxGuests: 6, available: false, amenities: ['3 Floors','360° Views','Private Chef','Helipad'], fullAmenities: ['3-floor private residence','360° panoramic atoll views','Dedicated private chef','Helicopter pad access','3 master bedrooms','Private cinema','Full-size tennis court','Rooftop infinity pool','Rolls-Royce transfer','Personal security team','Private spa suite','Underwater bedroom option'], rating: 5.0, reviews: 64 },
  { id: 4, tier: 'Garden Collection', name: 'Jungle Retreat', slug: 'jungle-retreat', shortDesc: 'Treehouse-inspired villa with wraparound tropical forest views.', description: "Immerse yourself in the island's verdant heart. A treehouse-inspired villa with wraparound jungle views.", pricePerNight: 1250, emoji: '🌿', bgColor: '#051205', size: '140 sqm', bedType: 'King', view: 'Tropical Forest', maxGuests: 2, available: true, amenities: ['Treehouse Style','Forest Bath','Yoga Deck','Bird Sanctuary'], fullAmenities: ['Elevated treehouse design','Private forest bathing area','Morning yoga deck','Birdwatching tower','King canopy bed','Organic minibar','Natural fibre furnishings','Outdoor bathtub','Hammock garden','Nature guide service','Sunrise meditation sessions','Herbal garden'], rating: 4.85, reviews: 139 },
  { id: 5, tier: 'Sunset Collection', name: 'Sunset Suite', slug: 'sunset-suite', shortDesc: 'West-facing sanctuary with the most breathtaking sunset panoramas.', description: 'Strategically positioned on the western tip of the island, offering the most breathtaking sunset panoramas.', pricePerNight: 2400, emoji: '🌅', bgColor: '#1A0A00', size: '320 sqm', bedType: 'Emperor', view: 'Horizon Sunset', maxGuests: 2, available: true, amenities: ['West Facing','Champagne Service','Sky Lounge','Private Chef'], fullAmenities: ['West-facing sunset position','Complimentary champagne at sundown','Private sky lounge','Personal chef for breakfast','Master bedroom + lounge','Roof terrace pool','Telescope observatory','Stargazing programme','Sunset butler','Monogrammed amenities','Daily floral arrangement','Sunset picnic service'], rating: 4.92, reviews: 211 },
  { id: 6, tier: 'Family Collection', name: 'Family Island Villa', slug: 'family-island-villa', shortDesc: 'Two connected beach villas designed for families seeking freedom.', description: 'Spanning two private beach villas connected by a garden walkway. Designed for families seeking absolute freedom.', pricePerNight: 4600, emoji: '🏡', bgColor: '#0A0A1A', size: '520 sqm', bedType: '4 Bedrooms', view: 'Beach & Lagoon', maxGuests: 8, available: true, amenities: ['2 Villas','Kids Zone','Family Pool','Nanny Service'], fullAmenities: ['2 interconnected beach villas','Dedicated kids activity zone','Family infinity pool','24hr professional nanny','4 bedrooms total','Home cinema room','Kids dining menu','Underwater explorer kit','Family buggy','Babysitting included','Kids spa treatments','Adventure programme'], rating: 4.88, reviews: 97 }
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
    { id: 't1', name: 'Amuse-Bouche Trilogy', description: 'Beluga caviar blini, tuna tartare with wasabi foam, truffle arancini', price: 48, tags: ['signature'], course: 'Starter' },
    { id: 't2', name: 'Lobster Bisque', description: 'Cold-water Maldivian lobster, saffron cream, cognac reduction, micro herbs', price: 64, tags: ['signature','spiced'], course: 'Soup' },
    { id: 't3', name: 'Wagyu Tenderloin A5', description: 'Japanese A5 wagyu, 36-hour sous vide, black truffle jus, potato fondant', price: 195, tags: ['signature'], course: 'Main' },
    { id: 't4', name: 'Tuna Tataki', description: 'Line-caught yellowfin tuna, sesame crust, ponzu dressing, pickled daikon', price: 88, tags: ['vegetarian-friendly'], course: 'Starter' },
    { id: 't5', name: 'Ocean Harvest Platter', description: 'Langoustine, oysters, half-shell scallops, tiger prawns, mignonette', price: 175, tags: ['signature'], course: 'Sharing' }
  ],
  alacarte: [
    { id: 'a1', name: 'Foie Gras Torchon', description: 'Duck liver torchon, brioche toast, fig compote, candied walnuts, aged balsamic', price: 72, tags: ['signature'], course: 'Starter' },
    { id: 'a2', name: 'Burrata Caprese', description: 'Heirloom tomatoes, buffalo burrata, basil oil, Maldon sea salt', price: 42, tags: ['vegetarian'], course: 'Starter' },
    { id: 'a3', name: 'Grilled Seabass', description: 'Whole island seabass, citrus butter, fennel confit, saffron velouté', price: 96, tags: ['signature','spiced'], course: 'Main' },
    { id: 'a4', name: 'Truffle Risotto', description: 'Aged Carnaroli rice, black truffle, aged Parmigiano-Reggiano, chive oil', price: 78, tags: ['vegetarian','signature'], course: 'Main' },
    { id: 'a5', name: 'Rack of Lamb', description: 'New Zealand rack, pistachio crust, herb jus, ratatouille, potato gratin', price: 145, tags: [], course: 'Main' }
  ],
  drinks: [
    { id: 'd1', name: 'Krug Grande Cuvée', description: 'Multi-vintage Champagne of extraordinary complexity. By glass or magnum', price: 95, tags: ['signature'], course: 'Sparkling' },
    { id: 'd2', name: 'Pétrus 2015', description: 'The legendary Pomerol. Blackcurrant, cedar, dark chocolate.', price: 3200, tags: ['signature'], course: 'Red Wine' },
    { id: 'd3', name: 'Aurum Old Fashioned', description: '18-year Macallan, house-smoked ice sphere, gold leaf, orange bitters', price: 65, tags: ['signature'], course: 'Cocktail' },
    { id: 'd4', name: 'Maldivian Sunset', description: 'Island rum, coconut water, passionfruit, lime, turmeric, edible flowers', price: 38, tags: ['signature','vegetarian'], course: 'Cocktail' },
    { id: 'd5', name: 'Virgin Sunset', description: 'Fresh tropical juices, coconut water, ginger, passion fruit, sparkling water', price: 22, tags: ['vegetarian','non-alcoholic'], course: 'Mocktail' }
  ],
  dessert: [
    { id: 'ds1', name: 'Valrhona Chocolate Sphere', description: 'Dark chocolate sphere, warm caramel, raspberry coulis, gold leaf, vanilla ice cream', price: 48, tags: ['signature','vegetarian'], course: 'Dessert' },
    { id: 'ds2', name: 'Mango Soufflé', description: 'Alphonso mango soufflé, Maldivian vanilla crème anglaise, mango sorbet', price: 38, tags: ['vegetarian'], course: 'Dessert' },
    { id: 'ds3', name: 'Cheese Trolley', description: '24 fine cheeses, seasonal accompaniments, artisanal crackers, house chutneys', price: 65, tags: ['signature'], course: 'Cheese' },
    { id: 'ds4', name: 'Île Flottante', description: 'Floating island, praline, spun caramel, vanilla custard, candied almonds', price: 34, tags: ['vegetarian'], course: 'Dessert' }
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
