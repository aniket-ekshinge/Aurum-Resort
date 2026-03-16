import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '../hooks';
import BookingForm from '../components/rooms/BookingForm';
import styles from './RoomDetailPage.module.css';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, loading, error } = useRoom(id);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error || !room) return (
    <div className={styles.notFound}>
      <h2>Suite not found</h2>
      <button className="btn btn-gold-outline" onClick={() => navigate('/rooms')}><span>Back to Suites</span></button>
    </div>
  );

  return (
    <>
      <Helmet><title>{room.name} — Aurum Resort</title></Helmet>

      <div className={styles.hero} style={{background:room.bgColor}}>
        {room.image ? (
          <img src={room.image} alt={room.name} className={styles.heroImg} />
        ) : (
          <div className={styles.heroEmoji}>{room.emoji}</div>
        )}
        <div className={styles.heroBadge}>{room.tier}</div>
      </div>

      <div className="section-wrapper" style={{paddingTop:'3rem'}}>
        <button className={styles.back} onClick={() => navigate('/rooms')}>← Back to Suites</button>

        <div className={styles.layout}>
          {/* LEFT: Room Info */}
          <div className={styles.info}>
            <div className={styles.tier}>{room.tier}</div>
            <h1 className={styles.name}>{room.name}</h1>
            <p className={styles.desc}>{room.description}</p>

            <div className={styles.specs}>
              {[
                { label: 'Suite Size', val: room.size },
                { label: 'Bedding', val: room.bedType },
                { label: 'View', val: room.view },
                { label: 'Max Guests', val: `${room.maxGuests} guests` },
              ].map(s => (
                <div key={s.label} className={styles.spec}>
                  <div className={styles.specLabel}>{s.label}</div>
                  <div className={styles.specVal}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className={styles.amenitiesSection}>
              <div className={styles.amenTitle}>Suite Amenities</div>
              <div className={styles.amenGrid}>
                {room.fullAmenities.map(a => (
                  <div key={a} className={styles.amenItem}>
                    <span className={styles.amenDot} />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>{'★'.repeat(5)}</div>
              <span className={styles.ratingNum}>{room.rating}</span>
              <span className={styles.ratingCount}>({room.reviews} reviews)</span>
            </div>
          </div>

          {/* RIGHT: Booking Form */}
          <div className={styles.bookingPanel}>
            <div className={styles.bookingPanelHeader}>
              <div className={styles.priceNum}>${room.pricePerNight.toLocaleString()}</div>
              <div className={styles.priceUnit}>per night, taxes included</div>
              <div className={`status-badge ${room.available ? 'status-available' : 'status-unavailable'}`} style={{marginTop:'8px',display:'inline-block'}}>
                {room.available ? 'Available' : 'Sold Out'}
              </div>
            </div>
            <BookingForm room={room} />
          </div>
        </div>
      </div>
    </>
  );
}
