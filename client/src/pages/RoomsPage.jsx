import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRooms } from '../hooks';
import RoomCard from '../components/rooms/RoomCard';
import VirtualTour from '../components/rooms/VirtualTour';
import styles from './RoomsPage.module.css';

const FILTERS = ['All', 'Available', 'Under $2,000', 'Under $5,000', 'Family'];

export default function RoomsPage() {
  const { rooms, loading, error } = useRooms();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = rooms.filter(r => {
    if (activeFilter === 'Available') return r.available;
    if (activeFilter === 'Under $2,000') return r.pricePerNight < 2000;
    if (activeFilter === 'Under $5,000') return r.pricePerNight < 5000;
    if (activeFilter === 'Family') return r.maxGuests >= 4;
    return true;
  });

  return (
    <>
      <Helmet><title>Suites & Villas — Aurum Resort</title></Helmet>

      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <p className="section-tag">Accommodation</p>
          <h1 className="section-title">Curated <em>Sanctuaries</em></h1>
          <p className="section-desc">Each villa is a masterpiece of understated opulence, designed by award-winning architects using materials sourced from around the world.</p>
        </div>
      </div>

      <div className="section-wrapper">
        {/* Filters */}
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          <span className={styles.count}>{filtered.length} suite{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Room Grid */}
        {loading && <div className="page-loader"><div className="spinner" /></div>}
        {error && <p style={{color:'var(--danger)',textAlign:'center',padding:'3rem'}}>{error}</p>}
        {!loading && !error && (
          <div className={styles.grid}>
            {filtered.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        )}

        {/* Virtual Tour */}
        <div style={{marginTop:'5rem'}}>
          <p className="section-tag">Immersive Preview</p>
          <h2 className="section-title">Virtual <em>Tour</em></h2>
          <p className="section-desc" style={{marginBottom:'2rem'}}>Step inside every corner of our legendary suites before you arrive.</p>
          <VirtualTour />
        </div>
      </div>
    </>
  );
}
