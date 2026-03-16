import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useLoyalty } from '../hooks';

import styles from './LoyaltyPage.module.css';

export default function LoyaltyPage() {
  const { member, perks, loading, redeemPoints } = useLoyalty();
  const [rate, setRate] = useState(3000);
  const [nights, setNights] = useState(5);
  const [simResult, setSimResult] = useState({ total: 15000, pts: 45000, val: 450 });
  const [redeeming, setRedeeming] = useState(false);

  const handleSlider = (field, val) => {
    const newRate = field === 'rate' ? Number(val) : rate;
    const newNights = field === 'nights' ? Number(val) : nights;
    if (field === 'rate') setRate(newRate); else setNights(newNights);
    const total = newRate * newNights;
    setSimResult({ total, pts: total * 3, val: Math.round(total * 3 * 0.01) });
  };

  const handleRedeem = async () => {
    if (!member || member.points < 500) { toast.error('Minimum 500 points to redeem'); return; }
    setRedeeming(true);
    try {
      await redeemPoints(500);
      toast.success(`500 points redeemed for $5 resort credit`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const pct = member ? Math.min((member.points / member.pointsToNextTier) * 100, 100) : 0;

  return (
    <>
      <Helmet><title>Aurum Privileges — Loyalty Rewards</title></Helmet>

      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <p className="section-tag">Aurum Privileges</p>
          <h1 className="section-title">Your <em>Rewards</em></h1>
          <p className="section-desc">Exclusive privileges that grow with every extraordinary moment shared with us.</p>
        </div>
      </div>

      <div className="section-wrapper">
        {/* MEMBER CARD */}
        {member && (
          <div className={styles.memberLayout}>
            <div className={styles.memberCard}>
              <div className={styles.tierBadge}>◈ {member.tier} Member</div>
              <div className={styles.memberName}>{member.name}</div>
              <div className={styles.memberMeta}>Member since {member.memberSince} · Card No. {member.id}</div>

              <div className={styles.pointsRow}>
                <span className={styles.pointsNum}>{member.points.toLocaleString()}</span>
                <span className={styles.pointsLabel}>Aurum Points</span>
              </div>

              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width:`${pct}%`}} />
              </div>
              <div className={styles.progressLabel}>
                {(member.pointsToNextTier - member.points).toLocaleString()} points to <strong style={{color:'var(--gold)'}}>{member.nextTier}</strong>
              </div>

              <div className={styles.cardActions}>
                <button className="btn btn-primary btn-sm" onClick={handleRedeem} disabled={redeeming}>
                  <span>{redeeming ? 'Redeeming...' : 'Redeem 500 pts'}</span>
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => toast.success('Points transfer initiated')}>
                  Transfer Points
                </button>
              </div>
            </div>

            <div className={styles.statsGrid}>
              {[
                { num: member.totalStays, label: 'Stays' },
                { num: member.totalNights, label: 'Nights' },
                { num: member.totalDining, label: 'Dining' },
                { num: `$${member.totalRedeemed}`, label: 'Redeemed' },
              ].map(s => (
                <div key={s.label} className={styles.statCard}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKING HISTORY */}
        {member && (
          <div className={styles.historySection}>
            <div className="section-tag" style={{marginBottom:'1rem'}}>Reservation History</div>
            {member.bookingHistory.map(b => (
              <div key={b.id} className={styles.bookingItem}>
                <div className={styles.bookingDate}>
                  <div className={styles.bookingDay}>{b.day}</div>
                  <div className={styles.bookingMonth}>{b.month}</div>
                </div>
                <div className={styles.bookingInfo}>
                  <div className={styles.bookingRoom}>{b.room}</div>
                  <div className={styles.bookingDetail}>{b.detail} · {b.year}</div>
                </div>
                <div className={styles.bookingRight}>
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  <div className={styles.bookingPts}>+{b.pointsEarned.toLocaleString()} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POINTS SIMULATOR */}
        <div className={styles.simulator}>
          <p className="section-tag" style={{marginBottom:'1rem'}}>Earn & Redeem</p>
          <h2 className="section-title">Points <em>Simulator</em></h2>
          <p style={{fontSize:'12px',color:'var(--smoke)',margin:'0.5rem 0 2rem'}}>Calculate how many points your next stay will earn.</p>

          <div className={styles.simSliders}>
            <div>
              <label className="form-label">Nightly Rate (USD)</label>
              <input type="range" min="500" max="15000" step="100" value={rate} onChange={e => handleSlider('rate', e.target.value)} style={{width:'100%'}} />
              <div className={styles.simValue}>${rate.toLocaleString()}</div>
            </div>
            <div>
              <label className="form-label">Number of Nights</label>
              <input type="range" min="1" max="30" step="1" value={nights} onChange={e => handleSlider('nights', e.target.value)} style={{width:'100%'}} />
              <div className={styles.simValue}>{nights} night{nights !== 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className={styles.simResults}>
            <div className={styles.simResultCard}><div className={styles.simNum}>${simResult.total.toLocaleString()}</div><div className={styles.simLabel}>Total Spend</div></div>
            <div className={styles.simResultCard}><div className={styles.simNum}>{simResult.pts.toLocaleString()}</div><div className={styles.simLabel}>Points Earned</div></div>
            <div className={styles.simResultCard}><div className={styles.simNum}>${simResult.val.toLocaleString()}</div><div className={styles.simLabel}>Points Value</div></div>
          </div>
        </div>

        {/* PERKS */}
        <div style={{marginTop:'4rem'}}>
          <p className="section-tag">Member Privileges</p>
          <h2 className="section-title">Platinum <em>Perks</em></h2>
          <div className={styles.perksGrid}>
            {perks.map(p => (
              <div key={p.id} className={styles.perkCard}>
                <div className={styles.perkIcon}>{p.icon}</div>
                <div className={styles.perkTier}>{p.tier}</div>
                <div className={styles.perkName}>{p.name}</div>
                <div className={styles.perkDesc}>{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
