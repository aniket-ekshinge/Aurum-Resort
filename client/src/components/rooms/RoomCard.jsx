import { useNavigate } from 'react-router-dom';
import styles from './RoomCard.module.css';

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/rooms/${room.slug}`)}>
      <div className={styles.visual} style={{ background: room.bgColor }}>
        <div className={styles.emoji}>{room.emoji}</div>
        <div className={styles.overlay}>
          <button className={`btn btn-sm ${styles.tourBtn}`} onClick={e => { e.stopPropagation(); navigate(`/rooms/${room.slug}?tour=1`); }}>
            ▶ Virtual Tour
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.tier}>{room.tier}</div>
        <h3 className={styles.name}>{room.name}</h3>
        <p className={styles.desc}>{room.shortDesc}</p>

        <div className={styles.amenities}>
          {room.amenities.slice(0, 4).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceNum}>${room.pricePerNight.toLocaleString()}</span>
            <span className={styles.priceUnit}> / night</span>
          </div>
          <div className={styles.availRow}>
            {room.available
              ? <><span className="pulse-dot" /> <span className={styles.availText}>Available</span></>
              : <span className={styles.soldOut}>Sold Out</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
