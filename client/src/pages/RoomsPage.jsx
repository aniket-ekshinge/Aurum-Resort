import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRooms } from '../hooks';
import RoomCard from '../components/rooms/RoomCard';
import VirtualTour from '../components/rooms/VirtualTour';
import TourModal from '../components/rooms/TourModal';
import styles from './RoomsPage.module.css';

const FILTERS = ['All', 'Available', 'Under $2,000', 'Under $5,000', 'Family'];

const ROOM_HOTSPOTS = {
  'royal-penthouse':    [{ x:'20%', y:'35%', tip:'King-size · Egyptian cotton' }, { x:'70%', y:'28%', tip:'Floor-to-ceiling glass walls' }, { x:'50%', y:'65%', tip:'Private infinity pool beyond' }],
  'ocean-villa':        [{ x:'30%', y:'40%', tip:'Custom marble fireplace' },     { x:'65%', y:'30%', tip:'60″ retractable cinema screen' }, { x:'45%', y:'68%', tip:'Beach access — 12 steps away' }],
  'overwater-bungalow': [{ x:'25%', y:'45%', tip:'Freestanding soaking tub' },    { x:'70%', y:'35%', tip:'Glass floor · lagoon view' },      { x:'50%', y:'62%', tip:'Outdoor ocean rain shower' }],
  'sunset-suite':       [{ x:'15%', y:'40%', tip:'Heated infinity pool' },        { x:'75%', y:'32%', tip:'Sunset cocktail bar' },            { x:'50%', y:'57%', tip:'Telescope observatory' }],
  'jungle-retreat':     [{ x:'30%', y:'38%', tip:'Canopy king bed' },             { x:'65%', y:'45%', tip:'Forest bathing deck' },            { x:'50%', y:'62%', tip:'Private herb garden below' }],
  'family-island-villa':[{ x:'20%', y:'42%', tip:'Kids activity zone' },          { x:'68%', y:'35%', tip:'Family infinity pool' },           { x:'48%', y:'65%', tip:'Private beach — direct access' }],
};

export default function RoomsPage() {
  const { rooms, loading, error } = useRooms();
  const [activeFilter, setActiveFilter] = useState('All');
  const [tourRoom, setTourRoom] = useState(null);

  const filtered = rooms.filter(r => {
    if (activeFilter === 'Available')    return r.available;
    if (activeFilter === 'Under $2,000') return r.pricePerNight < 2000;
    if (activeFilter === 'Under $5,000') return r.pricePerNight < 5000;
    if (activeFilter === 'Family')       return r.maxGuests >= 4;
    return true;
  });

  const handleTourClick = (room) => {
    setTourRoom({
      ...room,
      tourImage: room.tourImage || room.image,
      hotspots: ROOM_HOTSPOTS[room.slug] || [],
    });
  };

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
            {filtered.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onTourClick={handleTourClick}
              />
            ))}
          </div>
        )}

        {/* Virtual Tour section */}
        <div style={{marginTop:'5rem'}}>
          <p className="section-tag">Immersive Preview</p>
          <h2 className="section-title">Virtual <em>Tour</em></h2>
          <p className="section-desc" style={{marginBottom:'2rem'}}>Step inside every corner of our legendary suites before you arrive.</p>
          <VirtualTour />
        </div>
      </div>

      {/* Tour modal — fullscreen, outside grid */}
      {tourRoom && (
        <TourModal
          room={tourRoom}
          onClose={() => setTourRoom(null)}
        />
      )}
    </>
  );
}