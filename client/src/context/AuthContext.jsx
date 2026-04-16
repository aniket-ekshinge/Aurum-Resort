import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const TOKEN_KEY = 'aurum_token';
const USER_KEY  = 'aurum_user';

// Axios instance with auth header injected automatically
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
api.interceptors.response.use(r => r.data, err => {
  const msg = err.response?.data?.error || err.message || 'Something went wrong';
  return Promise.reject(new Error(msg));
});

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } });
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    api.get('/auth/me')
      .then(res => { setUser(res.data); localStorage.setItem(USER_KEY, JSON.stringify(res.data)); })
      .catch(() => { setUser(null); setToken(null); localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback((tok, usr) => {
    setToken(tok); setUser(usr);
    localStorage.setItem(TOKEN_KEY, tok);
    localStorage.setItem(USER_KEY, JSON.stringify(usr));
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      persist(res.data.token, res.data.user);
      toast.success(res.message || `Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      return { success: true, user: res.data.user };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      persist(res.data.token, res.data.user);
      toast.success('Welcome to Aurum Privileges! 500 bonus points awarded.');
      return { success: true, user: res.data.user };
    } catch (err) {
      toast.error(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    setUser(null); setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.success('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
