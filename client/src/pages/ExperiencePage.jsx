import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import styles from './ExperiencePage.module.css';

const EXPERIENCES = [
  { icon: '🏝️', title: 'Private Island', desc: 'Your private paradise across 47 acres of pristine Indian Ocean, accessible only by seaplane or private yacht.' },
  { icon: '✈️', title: 'Private Transfer', desc: 'Complimentary seaplane transfers from Malé International Airport for all guests staying 3 nights or more.' },
  { icon: '💆', title: 'Oceanic Spa', desc: '2,000 sq ft of over-water wellness sanctuary featuring 12 treatment rooms, a hammam, and Japanese onsen baths.' },
  { icon: '🤿', title: 'Marine Adventures', desc: 'PADI dive centre, whale shark excursions, submarine tours, night fishing on traditional dhonis, and coral restoration programmes.' },
  { icon: '🌟', title: 'Stargazing', desc: 'Astronomy evenings on the private telescope deck with our resident marine biologist and astronomy guide.' },
  { icon: '🎾', title: 'Sport & Wellness', desc: 'Floodlit tennis court, water sports centre, yoga pavilion, and daily guided meditation at sunrise.' },
  { icon: '🎭', title: 'Cultural Immersion', desc: 'Traditional Maldivian cooking classes, island storytelling evenings, and authentic dhoni fishing with local fishermen.' },
  { icon: '👶', title: 'Family Programme', desc: 'Dedicated Aurum Kids Club, underwater safari tours, coral planting initiatives, and professional nanny service.' },
];

export default function ExperiencePage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet><title>The Experience — Aurum Resort</title></Helmet>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <p className="section-tag">The Aurum Experience</p>
          <h1 className="section-title">Beyond <em>Imagination</em></h1>
          <p className="section-desc">A curated collection of moments designed to exceed every expectation.</p>
        </div>
      </div>
      <div className="section-wrapper">
        <div className={styles.grid}>
          {EXPERIENCES.map(e => (
            <div key={e.title} className={`card ${styles.expCard}`}>
              <div className={styles.icon}>{e.icon}</div>
              <h3 className={styles.expTitle}>{e.title}</h3>
              <p className={styles.expDesc}>{e.desc}</p>
            </div>
          ))}
        </div>
        <div className={styles.cta}>
          <p className={styles.ctaQuote}>"Every moment at Aurum is composed like music — precise, evocative, unforgettable."</p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',justifyContent:'center',marginTop:'2rem'}}>
            <button className="btn btn-primary" onClick={() => navigate('/rooms')}><span>Reserve a Suite</span></button>
            <button className="btn btn-outline" onClick={() => navigate('/dining')}>Book Dinner</button>
          </div>
        </div>
      </div>
    </>
  );
}
