import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reservationsApi, availabilityApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import styles from './DiningReservationPanel.module.css';

const today = new Date().toISOString().split('T')[0];
const ALL_TIMES = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
const BASE_TABLES = Array.from({ length: 20 }, (_, i) => ({
  number: i + 1,
  seats: i < 5 ? 2 : i < 15 ? 4 : 6,
}));

export default function DiningReservationPanel() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [form, setForm] = useState({ guestName: '', guestEmail: '', partySize: '2', specialRequests: '' });

  // Live availability fetched from the API — this is the single source of truth
  const [availData, setAvailData] = useState(null);
  const [availLoading, setAvailLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  // Pre-fill form from logged-in user
  useEffect(() => {
    if (user) setForm(p => ({ ...p, guestName: user.name || '', guestEmail: user.email || '' }));
  }, [user]);

  // Fetch real table/time availability whenever date changes
  const fetchAvailability = useCallback(async (d) => {
    setAvailLoading(true);
    setSelectedTable(null);
    setSelectedTime(null);
    try {
      const res = await availabilityApi.checkDining(d);
      setAvailData(res.data);
    } catch {
      setAvailData(null);
    } finally {
      setAvailLoading(false);
    }
  }, []);

  useEffect(() => { fetchAvailability(date); }, [date, fetchAvailability]);

  // Derive taken status from live API data
  // A table is "taken at selected time" if it appears in reservedTimes for that time slot
  const isTableTakenAtTime = (tableNumber) => {
    if (!availData || !selectedTime) return false;
    const t = availData.tables?.find(t => t.number === tableNumber);
    return t?.reservedTimes?.includes(selectedTime) ?? false;
  };

  // A table is taken at ALL times (show as fully taken regardless of time selection)
  const isTableFullyTaken = (tableNumber) => {
    if (!availData) return false;
    const t = availData.tables?.find(t => t.number === tableNumber);
    return t ? !t.available : false;
  };

  const isTimeFull = (time) => {
    if (!availData) return false;
    const t = availData.times?.find(t => t.time === time);
    return t ? !t.available : false;
  };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleTimeSelect = (time) => {
    if (isTimeFull(time)) return;
    setSelectedTime(time);
    // Clear table selection if it's now taken at this new time
    if (selectedTable && isTableTakenAtTime(selectedTable)) setSelectedTable(null);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to make a reservation'); navigate('/login'); return; }
    if (!selectedTable || !selectedTime) { toast.error('Please select a table and time'); return; }
    if (!form.guestName || !form.guestEmail) { toast.error('Name and email required'); return; }

    setSubmitting(true);
    try {
      const res = await reservationsApi.bookDining({
        date, time: selectedTime, tableNumber: selectedTable,
        partySize: Number(form.partySize), ...form,
      });
      setConfirmed(res.data);
      toast.success('Table reserved!');
      // Re-fetch availability so the table immediately shows as taken
      await fetchAvailability(date);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── CONFIRMATION SCREEN ─────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className={styles.confirmed}>
        <div className={styles.confirmedCheck}>✓</div>
        <h3 className={styles.confirmedTitle}>Table Reserved</h3>
        <p className={styles.confirmedCode}>{confirmed.confirmationCode}</p>
        <div className={styles.confirmedInfo}>
          <div><span>Date</span><span>{confirmed.date}</span></div>
          <div><span>Time</span><span>{confirmed.time}</span></div>
          <div><span>Table</span><span>#{confirmed.tableNumber}</span></div>
          <div><span>Guests</span><span>{confirmed.partySize}</span></div>
        </div>
        <button className="btn btn-gold-outline btn-full"
          onClick={() => { setConfirmed(null); setSelectedTable(null); setSelectedTime(null); }}>
          <span>Make Another Reservation</span>
        </button>
      </div>
    );
  }

  // ── MAIN PANEL ──────────────────────────────────────────────────────────
  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>Reserve Your Table</h3>
      <p className={styles.panelSub}>Each table is prepared for an intimate evening of culinary excellence.</p>

      {/* Auth gate banner */}
      {!isAuthenticated && (
        <div className={styles.authBanner}>
          <span>Sign in to complete your reservation</span>
          <button className="btn btn-gold-outline btn-sm" onClick={() => navigate('/login')}>
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Date */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label">Select Date</label>
        <input className="form-input" type="date" min={today} value={date}
          onChange={e => setDate(e.target.value)} />
      </div>

      {/* Time slots — sourced from real API */}
      <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>
        Select Time {availLoading && <span className={styles.loadingDots}>···</span>}
      </label>
      <div className={styles.timeGrid}>
        {ALL_TIMES.map(t => {
          const full = isTimeFull(t);
          const active = selectedTime === t;
          return (
            <button key={t}
              className={`${styles.timeSlot} ${full ? styles.unavail : ''} ${active ? styles.selectedTime : ''}`}
              onClick={() => handleTimeSelect(t)} disabled={full}>
              {t}
              {full && <span className={styles.fullTag}>Full</span>}
            </button>
          );
        })}
      </div>

      {/* Table grid — emojis driven by live availData */}
      <label className="form-label" style={{ display: 'block', margin: '1.5rem 0 6px' }}>
        Select Table {selectedTime && <span className={styles.timeHint}>for {selectedTime}</span>}
      </label>
      <div className={styles.legend}>
        <span><span className={styles.legendDot} style={{ background: 'rgba(201,168,76,0.3)' }} />Available</span>
        <span><span className={styles.legendDot} style={{ background: '#C9A84C' }} />Selected</span>
        <span><span className={styles.legendDot} style={{ background: 'rgba(239,83,80,0.5)' }} />Taken</span>
      </div>
      <div className={styles.tableGrid}>
        {BASE_TABLES.map(({ number, seats }) => {
          // "taken" means: taken at the currently-selected time (or fully taken if no time picked)
          const takenAtTime = selectedTime ? isTableTakenAtTime(number) : isTableFullyTaken(number);
          const fullyTaken  = isTableFullyTaken(number);
          const selected    = selectedTable === number;
          const clickable   = !takenAtTime && !fullyTaken;

          let icon = '🍽️';
          if (fullyTaken)   icon = '🔴';
          else if (takenAtTime) icon = '🔴';
          else if (selected) icon = '⭐';

          return (
            <div key={number}
              className={`${styles.tableCell}
                ${fullyTaken || takenAtTime ? styles.taken : ''}
                ${selected ? styles.selectedTable : ''}
                ${clickable ? styles.clickable : ''}`}
              onClick={() => clickable && setSelectedTable(number)}
              title={takenAtTime ? `Table ${number} — reserved at ${selectedTime}` : `Table ${number} · ${seats} seats`}
            >
              <span className={styles.tableIcon}>{icon}</span>
              <span className={styles.tableNum}>{number}</span>
              <span className={styles.tableSeats}>
                {fullyTaken || takenAtTime ? 'taken' : `${seats} seats`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Guest details */}
      <div className={styles.formFields}>
        <div className={styles.row}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="guestName" placeholder="Your name"
              value={form.guestName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" name="guestEmail" type="email"
              placeholder="email@example.com" value={form.guestEmail} onChange={handleChange} />
          </div>
        </div>
        <div className={styles.row}>
          <div className="form-group">
            <label className="form-label">Party Size</label>
            <select className="form-input form-select" name="partySize"
              value={form.partySize} onChange={handleChange}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Special Requests</label>
            <textarea className="form-input" name="specialRequests" rows={2}
              placeholder="Dietary needs, occasions..." value={form.specialRequests}
              onChange={handleChange} style={{ resize: 'none', paddingTop: '8px' }} />
          </div>
        </div>
      </div>

      {/* Summary strip */}
      {selectedTable && selectedTime && (
        <div className={styles.summary}>
          📅 {date} · ⏰ {selectedTime} · 🍽️ Table {selectedTable} · 👥 {form.partySize} guests
        </div>
      )}

      <button className="btn btn-primary btn-full" onClick={handleSubmit}
        disabled={submitting || !selectedTable || !selectedTime}>
        <span>{submitting ? 'Confirming...' : isAuthenticated ? 'Confirm Reservation' : 'Sign In to Reserve'}</span>
      </button>
    </div>
  );
}
