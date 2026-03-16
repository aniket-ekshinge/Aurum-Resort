import { useState, useEffect, useRef } from 'react';
import styles from './VirtualTour.module.css';

const TOUR_ROOMS = [
  { name: 'Royal Penthouse', label: 'Master Bedroom', desc: 'King-size bed with panoramic 360° ocean views', image: '/tours/Royal-Penthouse.png', hotspots: [{ x: '20%', y: '35%', tip: 'King-size · Egyptian cotton' }, { x: '70%', y: '28%', tip: 'Floor-to-ceiling glass walls' }, { x: '50%', y: '65%', tip: 'Private infinity pool beyond' }] },
  { name: 'Ocean Villa', label: 'Living Room', desc: 'Open-plan living with direct beach access', image: '/tours/ocean-villa.png', hotspots: [{ x: '30%', y: '40%', tip: 'Custom marble fireplace' }, { x: '65%', y: '30%', tip: '60" retractable cinema screen' }, { x: '45%', y: '68%', tip: 'Beach access — 12 steps away' }] },
  { name: 'Overwater Bungalow', label: 'Spa Bathroom', desc: 'Over-water spa bath with glass floor panel', image: '/tours/overwater-bungalow.png', hotspots: [{ x: '25%', y: '45%', tip: 'Freestanding soaking tub' }, { x: '70%', y: '35%', tip: 'Glass floor · lagoon view' }, { x: '50%', y: '62%', tip: 'Outdoor ocean rain shower' }] },
  { name: 'Sunset Suite', label: 'Rooftop Terrace', desc: 'Infinity rooftop pool facing the horizon', image: '/tours/sunset-suite.png', hotspots: [{ x: '15%', y: '40%', tip: 'Heated infinity pool' }, { x: '75%', y: '32%', tip: 'Sunset cocktail bar' }, { x: '50%', y: '57%', tip: 'Telescope observatory' }] },
];

export default function VirtualTour({ initialRoom = 0 }) {
  const [current, setCurrent] = useState(initialRoom);
  const [auto, setAuto]       = useState(false);
  const viewerRef             = useRef(null);   // holds the pannellum instance
  const timerRef              = useRef(null);
  const room                  = TOUR_ROOMS[current];

  // ── Init / update Pannellum whenever room changes ──────────────────────
  // Destructure BEFORE the effect — this is what ESLint requires
  const { image } = room;

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
  }, [current, image]);  // ← both current AND image in deps

  // ── Auto-play slideshow ────────────────────────────────────────────────
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

      {/* Header */}
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

      {/* Pannellum mounts into this div — id must match the viewer call above */}
      <div className={styles.viewport}>
        <div id="tour-container" className={styles.scene} />

        {/* Fallback shown only if no image provided for this room */}
        {!room.image && (
          <div className={styles.noImageFallback}>
            <div className={styles.roomName}>{room.name}</div>
            <div className={styles.roomDesc}>{room.desc}</div>
          </div>
        )}

        {/* Hotspot overlay — sits on top of the pannellum canvas */}
        <div className={styles.hotspotLayer}>
          {room.hotspots.map((hs, i) => (
            <div key={i} className={styles.hotspot} style={{ left: hs.x, top: hs.y }}>
              <div className={styles.hotspotDot} />
              <div className={styles.tooltip}>{hs.tip}</div>
            </div>
          ))}
        </div>

        <div className={styles.dragHint}>Drag to explore · Click hotspots to discover</div>
      </div>

      {/* Room nav tabs */}
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