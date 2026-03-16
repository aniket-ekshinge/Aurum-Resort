import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>AURUM</div>
          <p className={styles.tagline}>
            A private island sanctuary in the heart of the Indian Ocean, where time slows to the rhythm of the tides.
          </p>
          <div className={styles.social}>
            {['IG', 'FB', 'PT', 'TW'].map(s => (
              <button key={s} className={styles.socialBtn}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>Accommodation</div>
          <ul className={styles.footerLinks}>
            <li><Link to="/rooms">Ocean Villas</Link></li>
            <li><Link to="/rooms">Overwater Bungalows</Link></li>
            <li><Link to="/rooms">Royal Penthouse</Link></li>
            <li><Link to="/rooms">Garden Retreats</Link></li>
          </ul>
        </div>

        <div>
          <div className={styles.colTitle}>Experiences</div>
          <ul className={styles.footerLinks}>
            <li><Link to="/dining">Fine Dining</Link></li>
            <li><Link to="/experience">Oceanic Spa</Link></li>
            <li><Link to="/experience">Dive Centre</Link></li>
            <li><Link to="/experience">Events & Weddings</Link></li>
          </ul>
        </div>

        <div>
          <div className={styles.colTitle}>Contact</div>
          <ul className={styles.footerLinks}>
            <li><span>+960 300 1924</span></li>
            <li><span>reservations@aurum.mv</span></li>
            <li><span>North Malé Atoll, Maldives 20026</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <span className={styles.copy}>© {new Date().getFullYear()} Aurum Resort & Residences. All rights reserved.</span>
        <div className={styles.legal}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
