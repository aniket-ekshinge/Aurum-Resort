import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/rooms',      label: 'Suites' },
  { to: '/dining',     label: 'Dining' },
  { to: '/loyalty',    label: 'Rewards' },
  { to: '/experience', label: 'Experience' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.logo}>
        AURUM<span className={styles.logoSub}> RESORT</span>
      </NavLink>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              {label}
            </NavLink>
          </li>
        ))}
        {isAdmin && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => `${styles.link} ${styles.adminLink} ${isActive ? styles.active : ''}`}>
              Admin ◈
            </NavLink>
          </li>
        )}
      </ul>

      <div className={styles.authArea}>
        {isAuthenticated ? (
          <>
            <div className={styles.userInfo} onClick={() => navigate('/loyalty')} title="View Rewards">
              <div className={styles.avatar}>{user?.name?.[0] || '?'}</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <span className={styles.userTier}>{user?.loyaltyTier}</span>
              </div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/'); }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-gold-outline btn-sm" onClick={() => navigate('/rooms')}><span>Reserve</span></button>
          </>
        )}
      </div>
    </nav>
  );
}
