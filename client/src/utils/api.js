import axios from 'axios';

const TOKEN_KEY = 'aurum_token';
console.log("API URL:", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: "https://aurum-resort.onrender.com",
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const roomsApi = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get('/rooms/' + id),
  getAvailability: (id) => api.get('/rooms/' + id + '/availability'),
};

export const availabilityApi = {
  checkRooms: (params) => api.get('/availability/rooms', { params }),
  checkDining: (date) => api.get('/availability/dining', { params: { date } }),
};

export const reservationsApi = {
  bookRoom: (data) => api.post('/reservations/room', data),
  bookDining: (data) => api.post('/reservations/dining', data),
  getMyRoomBookings: () => api.get('/reservations/room/my'),
  getMyDiningReservations: () => api.get('/reservations/dining/my'),
  cancel: (id) => api.delete('/reservations/' + id),
  getAllRoomBookings: () => api.get('/reservations/room'),
};

export const menuApi = {
  getAll: () => api.get('/menu'),
  getCategory: (cat, tags) => api.get('/menu/' + cat, { params: tags ? { tags } : {} }),
};

export const loyaltyApi = {
  getMember: () => api.get('/loyalty/member'),
  getPerks: (tier) => api.get('/loyalty/perks', { params: tier ? { tier } : {} }),
  redeemPoints: (points) => api.post('/loyalty/redeem', { points }),
  simulate: (rate, nights) => api.get('/loyalty/simulate', { params: { rate, nights } }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status) => api.patch('/admin/bookings/' + id + '/status', { status }),
  getDining: (params) => api.get('/admin/dining', { params }),
  updateDiningStatus: (id, status) => api.patch('/admin/dining/' + id + '/status', { status }),
  getRooms: () => api.get('/admin/rooms'),
  updateRoomAvailability: (id, available) => api.patch('/admin/rooms/' + id + '/availability', { available }),
  updateRoomPrice: (id, price) => api.patch('/admin/rooms/' + id + '/price', { pricePerNight: price }),
  getUsers: () => api.get('/admin/users'),
  getRevenue: () => api.get('/admin/revenue'),
};

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export default api;
