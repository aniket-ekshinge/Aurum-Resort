import { useState, useEffect, useRef } from 'react';
import styles from './VirtualTour.module.css';

const TOUR_ROOMS = [
  { name: 'Royal Penthouse', label: 'Master Bedroom', desc: 'King-size bed with panoramic 360° ocean views', image: '/tours/Royal-Penthouse.png' },
  { name: 'Ocean Villa', label: 'Living Room', desc: 'Open-plan living with direct beach access', image: '/tours/ocean-villa.png' },
  { name: 'Overwater Bungalow', label: 'Spa Bathroom', desc: 'Over-water spa bath with glass floor panel', image: '/tours/overwater-bungalow.png' },
  { name: 'Sunset Suite', label: 'Rooftop Terrace', desc: 'Infinity rooftop pool facing the horizon', image: '/tours/sunset-suite.png' },
];

export default function VirtualTour({ initialRoom = 0 }) {
  const [current, setCurrent] = useState(initialRoom);
  const [auto, setAuto]       = useState(false);
  const viewerRef             = useRef(null);
  const timerRef              = useRef(null);
  const room                  = TOUR_ROOMS[current];
  const { image }             = room;

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }
    if (image && window.pannellum) {
      viewerRef.current = window.pannellum.viewer('tour-container', {
        type: 'equirectangular',
        panorama: image,
        autoLoad: true,
        autoRotate: -2,
        autoRotateInactivityDelay: 3000,
        showControls: false,
        compass: false,
        mouseZoom: false,
        keyboardZoom: false,
        hfov: 100,
      });
    }
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [current, image]);

  useEffect(() => {
    if (auto) {
      timerRef.current = setInterval(() => setCurrent(c => (c + 1) % TOUR_ROOMS.length), 5000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [auto]);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.label}>{room.label}</div>
          <div className={styles.title}>{room.name} — Interactive Tour</div>
        </div>
        <div className={styles.controls}>
          <button className={styles.ctrl} onClick={() => setCurrent(c => (c - 1 + TOUR_ROOMS.length) % TOUR_ROOMS.length)}>‹</button>
          <button className={`${styles.ctrl} ${auto ? styles.active : ''}`} onClick={() => setAuto(a => !a)}>{auto ? '⏸' : '▶'}</button>
          <button className={styles.ctrl} onClick={() => setCurrent(c => (c + 1) % TOUR_ROOMS.length)}>›</button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div id="tour-container" className={styles.scene} />

        {!image && (
          <div className={styles.noImageFallback}>
            <div className={styles.roomName}>{room.name}</div>
            <div className={styles.roomDesc}>{room.desc}</div>
          </div>
        )}
      </div>

      <div className={styles.navBar}>
        {TOUR_ROOMS.map((r, i) => (
          <button
            key={i}
            className={`${styles.navItem} ${i === current ? styles.navActive : ''}`}
            onClick={() => setCurrent(i)}
          >
            {r.name}
          </button>
        ))}
      </div>

    </div>
  );
}