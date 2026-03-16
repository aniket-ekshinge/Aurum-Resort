import { useEffect, useRef, useCallback } from 'react';
import styles from './TourModal.module.css';

export default function TourModal({ room, onClose }) {
  const viewerRef = useRef(null);

  const initViewer = useCallback(() => {
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }
    if (!room.tourImage || !window.pannellum) return;

    viewerRef.current = window.pannellum.viewer('pannellum-modal', {
      type: 'equirectangular',
      panorama: room.tourImage,
      autoLoad: true,
      autoRotate: -1.5,
      autoRotateInactivityDelay: 2000,
      showControls: false,
      compass: false,
      mouseZoom: true,
      hfov: 100,
      minHfov: 50,
      maxHfov: 120,
    });
  }, [room]);

  useEffect(() => {
    const t = setTimeout(initViewer, 80);
    return () => {
      clearTimeout(t);
      if (viewerRef.current) { viewerRef.current.destroy(); viewerRef.current = null; }
    };
  }, [initViewer]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.tag}>360° Virtual Tour</span>
            <span className={styles.roomName}>{room.name}</span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.hint}>🖱 Drag to look around · Scroll to zoom</span>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {room.tourImage ? (
          <div id="pannellum-modal" className={styles.viewer} />
        ) : (
          <div className={styles.noTour}>
            <div className={styles.noTourEmoji}>{room.emoji}</div>
            <p>360° tour coming soon for {room.name}</p>
          </div>
        )}

        {room.hotspots && room.hotspots.length > 0 && (
          <div className={styles.hotspotLayer}>
            {room.hotspots.map((hs, i) => (
              <div key={i} className={styles.hotspot} style={{ left: hs.x, top: hs.y }}>
                <div className={styles.dot} />
                <div className={styles.tooltip}>{hs.tip}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          {room.amenities?.slice(0, 4).map(a => (
            <span key={a} className={styles.amenityTag}>{a}</span>
          ))}
          <span className={styles.price}>${room.pricePerNight?.toLocaleString()} / night</span>
        </div>

      </div>
    </div>
  );
}