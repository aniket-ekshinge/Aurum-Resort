import { useState, useEffect, useCallback } from 'react';
import { roomsApi, menuApi, loyaltyApi, availabilityApi } from '../utils/api';

// Generic async data hook
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result.data);
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute };
}

// Rooms
export function useRooms(filters = {}) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await roomsApi.getAll(params || filters);
      setRooms(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  return { rooms, loading, error, refetch: fetchRooms };
}

// Single room
export function useRoom(id) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    roomsApi.getById(id)
      .then(res => setRoom(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { room, loading, error };
}

// Menu
export function useMenu() {
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    menuApi.getAll()
      .then(res => setMenu(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { menu, loading, error };
}

// Loyalty
export function useLoyalty() {
  const [member, setMember] = useState(null);
  const [perks, setPerks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [memberRes, perksRes] = await Promise.all([loyaltyApi.getMember(), loyaltyApi.getPerks()]);
      setMember(memberRes.data);
      setPerks(perksRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const redeemPoints = useCallback(async (points) => {
    const res = await loyaltyApi.redeemPoints(points);
    setMember(prev => ({ ...prev, points: res.data.remainingPoints }));
    return res;
  }, []);

  return { member, perks, loading, error, refetch: fetchAll, redeemPoints };
}

// Availability check
export function useAvailability() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const check = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const res = await availabilityApi.checkRooms(params);
      setResults(res);
      return res;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, check };
}

// Dining availability
export function useDiningAvailability(date) {
  const [dining, setDining] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    availabilityApi.checkDining(date)
      .then(res => setDining(res.data))
      .catch(() => setDining(null))
      .finally(() => setLoading(false));
  }, [date]);

  return { dining, loading };
}
