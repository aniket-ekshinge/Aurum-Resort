import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reservationsApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import styles from './BookingForm.module.css';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export default function BookingForm({ room, onSuccess }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    checkIn: tomorrow, checkOut: '',
    guests: '2',
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 0;
  const total = nights * room.pricePerNight;

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to book'); navigate('/login', { state: { from: `/rooms/${room.slug}` } }); return; }
    if (!nights || nights < 1) { toast.error('Check-out must be after check-in'); return; }
    setLoading(true);
    try {
      const res = await reservationsApi.bookRoom({ roomId: room.id, ...form, guests: Number(form.guests) });
      setConfirmed(res.data);
      toast.success('Reservation confirmed!');
      onSuccess?.(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className={styles.confirmed}>
        <div className={styles.confirmedIcon}>✓</div>
        <h3 className={styles.confirmedTitle}>Reservation Confirmed</h3>
        <p className={styles.confirmedCode}>{confirmed.confirmationCode}</p>
        <div className={styles.confirmedDetails}>
          <div className={styles.confirmedRow}><span>Room</span><span>{confirmed.roomName}</span></div>
          <div className={styles.confirmedRow}><span>Check-in</span><span>{confirmed.checkIn}</span></div>
          <div className={styles.confirmedRow}><span>Check-out</span><span>{confirmed.checkOut}</span></div>
          <div className={styles.confirmedRow}><span>Nights</span><span>{confirmed.nights}</span></div>
          <div className={styles.confirmedRow}><span>Total</span><span style={{color:'var(--gold)'}}>${confirmed.totalPrice.toLocaleString()}</span></div>
          <div className={styles.confirmedRow}><span>Points earned</span><span style={{color:'var(--gold)'}}>{confirmed.pointsEarned.toLocaleString()} pts</span></div>
        </div>
        <p className={styles.confirmedNote}>Confirmation sent. Our concierge will contact you within 2 hours.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Auth gate */}
      {!isAuthenticated && (
        <div className={styles.authBanner}>
          <span>Sign in to complete your booking</span>
          <button type="button" className="btn btn-gold-outline btn-sm"
            onClick={() => navigate('/login', { state: { from: `/rooms/${room.slug}` } })}>
            <span>Sign In</span>
          </button>
        </div>
      )}

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Check In</label>
          <input className="form-input" type="date" name="checkIn" min={today} value={form.checkIn} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Check Out</label>
          <input className="form-input" type="date" name="checkOut" min={form.checkIn || today} value={form.checkOut} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Guests</label>
        <select className="form-input form-select" name="guests" value={form.guests} onChange={handleChange}>
          {Array.from({ length: room.maxGuests }, (_, i) => (
            <option key={i+1} value={i+1}>{i+1} Guest{i > 0 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" type="text" name="guestName" placeholder="Your name" value={form.guestName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="guestEmail" placeholder="your@email.com" value={form.guestEmail} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Special Requests</label>
        <textarea className="form-input" name="specialRequests" rows={2}
          placeholder="Dietary requirements, occasions, preferences..."
          value={form.specialRequests} onChange={handleChange}
          style={{resize:'none', paddingTop:'8px'}} />
      </div>

      {nights > 0 && (
        <div className={styles.priceSummary}>
          <div className={styles.priceRow}>
            <span>${room.pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Aurum Points earned</span>
            <span style={{color:'var(--gold)'}}>{(total * 3).toLocaleString()} pts</span>
          </div>
          <div className={styles.priceTotal}>
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button className="btn btn-primary btn-full" type="submit" disabled={loading || !room.available}>
        <span>
          {!isAuthenticated ? 'Sign In to Book' : loading ? 'Processing...' : room.available ? 'Confirm Reservation' : 'Currently Unavailable'}
        </span>
      </button>
    </form>
  );
}
