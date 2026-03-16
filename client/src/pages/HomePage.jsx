import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { availabilityApi } from '../utils/api';
import styles from './HomePage.module.css';

const today = new Date().toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

const STATS = [
  { num: '47', label: 'Private Villas' },
  { num: '3', label: 'Michelin Stars' },
  { num: '6★', label: 'Forbes Rating' },
  { num: '24/7', label: 'Butler Service' },
  { num: '98%', label: 'Guest Satisfaction' },
];

const HIGHLIGHTS = [
  { icon: '🏝️', title: 'Private Island', desc: 'Your paradise across 47 acres of pristine Indian Ocean, accessible by seaplane or private yacht.' },
  { icon: '🍽️', title: '3 Michelin Stars', desc: 'Chef Alessandro Moretti curates an unrivalled culinary journey drawing from land, sea, and sky.' },
  { icon: '💆', title: 'Oceanic Spa', desc: '2,000 sq ft of over-water wellness featuring 12 treatment rooms, hammam, and Japanese onsen.' },
  { icon: '🤿', title: 'Marine Adventures', desc: 'PADI dive centre, whale shark tours, submarine experiences, and coral restoration programmes.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(nextWeek);
  const [roomType, setRoomType] = useState('');
  const [guests, setGuests] = useState('2');
  const [checking, setChecking] = useState(false);
  const [availResult, setAvailResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (new Date(checkOut) <= new Date(checkIn)) { toast.error('Check-out must be after check-in'); return; }
    setChecking(true);
    setAvailResult(null);
    try {
      const res = await availabilityApi.checkRooms({ checkIn, checkOut, guests, roomType });
      setAvailResult(res);
      toast.success(`${res.count} suite${res.count !== 1 ? 's' : ''} available`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <Helmet><title>Aurum Resort — Ultra-Luxury Private Island, Maldives</title></Helmet>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroOrnament} />
          <p className={styles.heroTag}>Est. 1924 · Maldives · Private Island</p>
          <h1 className={styles.heroTitle}>
            Where Luxury<br />Meets <em>Eternity</em>
          </h1>
          <p className={styles.heroSubtitle}>An unparalleled sanctuary for the discerning traveller</p>
          <div className={styles.heroActions}>
            <button className="btn btn-primary" onClick={() => navigate('/rooms')}>
              <span>Explore Suites</span>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/dining')}>
              View Menu
            </button>
          </div>
        </div>
        <div className={styles.heroStats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.heroStat}>
              <div className={styles.heroStatNum}>{s.num}</div>
              <div className={styles.heroStatLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING BAR */}
      <div className={styles.bookingBar}>
        <div className={styles.bookingBarLabel}>Real-Time Availability Check</div>
        <form className={styles.bookingForm} onSubmit={handleCheck}>
          <div className="form-group">
            <label className="form-label">Check In</label>
            <input className="form-input" type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Check Out</label>
            <input className="form-input" type="date" min={checkIn} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Suite Type</label>
            <select className="form-input form-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
              <option value="">All Suites</option>
              <option value="Ocean Villa">Ocean Villa</option>
              <option value="Overwater">Overwater Bungalow</option>
              <option value="Penthouse">Royal Penthouse</option>
              <option value="Jungle">Jungle Retreat</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Guests</label>
            <select className="form-input form-select" value={guests} onChange={e => setGuests(e.target.value)}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" type="submit" disabled={checking}>
            <span>{checking ? 'Checking...' : 'Check Availability'}</span>
          </button>
        </form>
        {availResult && (
          <div className={styles.availResult}>
            <span style={{color:'var(--gold)'}}>✓</span> {availResult.count} suite{availResult.count !== 1 ? 's' : ''} available for {availResult.nights} night{availResult.nights !== 1 ? 's' : ''}.{' '}
            <button onClick={() => navigate('/rooms')} className={styles.viewAllLink}>View all suites →</button>
          </div>
        )}
      </div>

      {/* HIGHLIGHTS */}
      <section className={styles.highlights}>
        <div className="section-wrapper">
          <p className="section-tag">The Aurum Experience</p>
          <h2 className="section-title">Redefining <em>Luxury</em></h2>
          <p className="section-desc" style={{marginBottom:'3rem'}}>A century of perfecting the art of island hospitality.</p>
          <div className={styles.highlightGrid}>
            {HIGHLIGHTS.map(h => (
              <div key={h.title} className={`card ${styles.highlightCard}`}>
                <div className={styles.highlightIcon}>{h.icon}</div>
                <h3 className={styles.highlightTitle}>{h.title}</h3>
                <p className={styles.highlightDesc}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteContent}>
          <p className={styles.quoteText}>"The measure of true luxury is not in what you can see, but in what you cannot see — and cannot forget."</p>
          <p className={styles.quoteAuthor}>— Alexander Aurum, Founder 1924</p>
          <div className={styles.quoteActions}>
            <button className="btn btn-primary" onClick={() => navigate('/rooms')}><span>View Our Suites</span></button>
            <button className="btn btn-outline" onClick={() => navigate('/dining')}>Reserve Dinner</button>
          </div>
        </div>
      </section>
    </>
  );
}
