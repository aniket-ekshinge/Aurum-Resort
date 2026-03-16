import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMenu } from '../hooks';
import DiningReservationPanel from '../components/dining/DiningReservationPanel';
import styles from './DiningPage.module.css';

const TABS = [
  { key: 'tasting', label: 'Tasting Menu' },
  { key: 'alacarte', label: 'À La Carte' },
  { key: 'drinks', label: 'Cellar & Bar' },
  { key: 'dessert', label: 'Patisserie' },
];

const TAG_STYLE = {
  signature: { bg: 'rgba(201,168,76,0.1)', color: 'var(--gold)', border: 'rgba(201,168,76,0.3)', label: 'Signature' },
  vegetarian: { bg: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: 'rgba(76,175,80,0.3)', label: 'Vegetarian' },
  'vegetarian-friendly': { bg: 'rgba(76,175,80,0.08)', color: '#4CAF50', border: 'rgba(76,175,80,0.2)', label: 'Veg-Friendly' },
  spiced: { bg: 'rgba(255,87,34,0.1)', color: '#FF5722', border: 'rgba(255,87,34,0.3)', label: 'Spiced' },
  'non-alcoholic': { bg: 'rgba(33,150,243,0.1)', color: '#2196F3', border: 'rgba(33,150,243,0.3)', label: 'Non-Alcoholic' },
};

function TagPill({ tag }) {
  const s = TAG_STYLE[tag];
  if (!s) return null;
  return (
    <span style={{ fontSize:8, padding:'2px 8px', background:s.bg, color:s.color, border:`1px solid ${s.border}`, letterSpacing:1, textTransform:'uppercase', fontWeight:600 }}>
      {s.label}
    </span>
  );
}

export default function DiningPage() {
  const { menu, loading } = useMenu();
  const [activeTab, setActiveTab] = useState('tasting');

  const items = menu[activeTab] || [];

  return (
    <>
      <Helmet><title>Fine Dining — Aurum Resort</title></Helmet>

      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <p className="section-tag">Culinary Arts</p>
          <h1 className="section-title">Fine <em>Dining</em></h1>
          <p className="section-desc">Three Michelin-starred cuisine by Chef Alessandro Moretti. An orchestra of flavours drawn from land, sea, and sky.</p>
        </div>
      </div>

      <div className="section-wrapper">
        <div className={styles.layout}>
          {/* MENU */}
          <div>
            <div className={styles.tabs}>
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`${styles.tab} ${activeTab === t.key ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {loading && <div className="page-loader"><div className="spinner" /></div>}

            {!loading && (
              <div className={styles.menuList}>
                {items.map(item => (
                  <div key={item.id} className={styles.menuItem}>
                    <div className={styles.menuItemInfo}>
                      <div className={styles.menuItemName}>{item.name}</div>
                      <div className={styles.menuItemCourse}>{item.course}</div>
                      <div className={styles.menuItemDesc}>{item.description}</div>
                      <div className={styles.menuItemTags}>
                        {item.tags.map(t => <TagPill key={t} tag={t} />)}
                      </div>
                    </div>
                    <div className={styles.menuItemPrice}>${item.price}</div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.chefNote}>
              <div className={styles.chefNoteText}>
                "Every dish at Aurum is a story — of the ocean, the island, the season, and the people who have gathered here across a century."
              </div>
              <div className={styles.chefSig}>— Chef Alessandro Moretti, Executive Chef</div>
            </div>
          </div>

          {/* RESERVATION PANEL */}
          <DiningReservationPanel />
        </div>
      </div>
    </>
  );
}
