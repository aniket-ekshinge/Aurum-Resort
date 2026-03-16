import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const e = {};
    if (tab === 'register' && form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = tab === 'login'
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    if (result.success) {
      navigate(result.user?.role === 'admin' ? '/admin' : from, { replace: true });
    }
  };

  return (
    <>
      <Helmet><title>{tab === 'login' ? 'Sign In' : 'Create Account'} — Aurum Resort</title></Helmet>

      <div className={styles.page}>
        <div className={styles.bg} />

        <div className={styles.card}>
          <div className={styles.logo}>AURUM</div>
          <p className={styles.subtitle}>
            {tab === 'login' ? 'Sign in to your Privileges account' : 'Join Aurum Privileges'}
          </p>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`} onClick={() => { setTab('login'); setErrors({}); }}>Sign In</button>
            <button className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`} onClick={() => { setTab('register'); setErrors({}); }}>Create Account</button>
          </div>

          {/* Demo credentials hint */}
          {tab === 'login' && (
            <div className={styles.demoHint}>
              <div className={styles.demoRow}><span>Guest demo:</span><code>alex@aurum.com / alex123</code></div>
              <div className={styles.demoRow}><span>Admin demo:</span><code>admin@aurum.com / admin2024</code></div>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className={`form-input ${errors.name ? styles.inputError : ''}`} type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className={`form-input ${errors.email ? styles.inputError : ''}`} type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className={`form-input ${errors.password ? styles.inputError : ''}`} type="password" placeholder={tab === 'register' ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
              <span>{loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {tab === 'register' && (
            <p className={styles.bonusNote}>🎁 Receive 500 welcome points on registration</p>
          )}
        </div>
      </div>
    </>
  );
}
