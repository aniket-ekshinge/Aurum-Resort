import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminDashboard.module.css';

const TABS = ['Overview', 'Bookings', 'Dining', 'Rooms', 'Guests'];

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue} style={color ? { color } : {}}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { confirmed: 'statusConfirmed', cancelled: 'statusCancelled', completed: 'statusCompleted', 'no-show': 'statusNoShow' };
  return <span className={`${styles.badge} ${styles[map[status] || 'statusConfirmed']}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [dining, setDining] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('');
  const [diningDate, setDiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingPrice, setEditingPrice] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadStats = useCallback(async () => {
    try { const r = await adminApi.getStats(); setStats(r.data); } catch {}
  }, []);

  const loadBookings = useCallback(async () => {
    try { const r = await adminApi.getBookings(bookingFilter ? { search: bookingFilter } : {}); setBookings(r.data); } catch {}
  }, [bookingFilter]);

  const loadDining = useCallback(async () => {
    try { const r = await adminApi.getDining({ date: diningDate }); setDining(r.data); } catch {}
  }, [diningDate]);

  const loadRooms = useCallback(async () => {
    try {
      const [rm, rv] = await Promise.all([adminApi.getRooms(), adminApi.getRevenue()]);
      setRooms(rm.data); setRevenue(rv.data);
    } catch {}
  }, []);

  const loadUsers = useCallback(async () => {
    try { const r = await adminApi.getUsers(); setUsers(r.data); } catch {}
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadStats(), loadBookings(), loadDining(), loadRooms(), loadUsers()]).finally(() => setLoading(false));
  }, []); // eslint-disable-line

  useEffect(() => { if (activeTab === 'Bookings') loadBookings(); }, [activeTab, bookingFilter, loadBookings]);
  useEffect(() => { if (activeTab === 'Dining') loadDining(); }, [activeTab, diningDate, loadDining]);

  const updateBookingStatus = async (id, status) => {
    try { await adminApi.updateBookingStatus(id, status); toast.success(`Status → ${status}`); loadBookings(); loadStats(); }
    catch (err) { toast.error(err.message); }
  };

  const updateDiningStatus = async (id, status) => {
    try { await adminApi.updateDiningStatus(id, status); toast.success(`Status → ${status}`); loadDining(); loadStats(); }
    catch (err) { toast.error(err.message); }
  };

  const toggleRoomAvailability = async (id, current) => {
    try { await adminApi.updateRoomAvailability(id, !current); toast.success(`Room ${!current ? 'opened' : 'closed'}`); loadRooms(); loadStats(); }
    catch (err) { toast.error(err.message); }
  };

  const savePrice = async (id) => {
    const price = editingPrice[id];
    if (!price || isNaN(price)) return;
    try { await adminApi.updateRoomPrice(id, price); toast.success('Price updated'); setEditingPrice(p => { const n = { ...p }; delete n[id]; return n; }); loadRooms(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <>
      <Helmet><title>Admin Dashboard — Aurum Resort</title></Helmet>

      <div className={styles.shell}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>AURUM<span className={styles.sidebarAdmin}>ADMIN</span></div>
          <nav className={styles.sidebarNav}>
            {TABS.map(t => (
              <button key={t} className={`${styles.navItem} ${activeTab === t ? styles.navActive : ''}`} onClick={() => setActiveTab(t)}>
                <span className={styles.navIcon}>{t === 'Overview' ? '◈' : t === 'Bookings' ? '🛏' : t === 'Dining' ? '🍽' : t === 'Rooms' ? '🏝' : '👤'}</span>
                {t}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <button className={styles.viewSiteBtn} onClick={() => navigate('/')}>← View Site</button>
            <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Sign Out</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <div className={styles.topBar}>
            <h1 className={styles.pageTitle}>{activeTab}</h1>
            <div className={styles.topBarRight}>
              <span className={styles.liveLabel}><span className={styles.liveDot} /> Live</span>
              <button className={styles.refreshBtn} onClick={() => { loadStats(); loadBookings(); loadDining(); loadRooms(); loadUsers(); }}>↻ Refresh</button>
            </div>
          </div>

          {loading && <div className="page-loader"><div className="spinner" /></div>}

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {!loading && activeTab === 'Overview' && stats && (
            <div className={styles.overviewGrid}>
              <div className={styles.statsRow}>
                <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="var(--gold)" />
                <StatCard label="Active Bookings" value={stats.activeBookings} sub={`${stats.totalRoomBookings} total`} />
                <StatCard label="Occupancy Rate" value={`${stats.occupancyRate}%`} color={stats.occupancyRate > 70 ? '#4CAF50' : 'var(--gold)'} />
                <StatCard label="Today's Dining" value={stats.todayDiningReservations} sub={`${stats.totalDiningReservations} total`} />
                <StatCard label="Registered Guests" value={stats.totalGuests} />
                <StatCard label="Available Rooms" value={`${stats.availableRooms}/${stats.totalRooms}`} />
              </div>

              {/* Revenue breakdown */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Revenue by Suite</div>
                <div className={styles.revenueList}>
                  {revenue.map(r => {
                    const max = revenue[0]?.revenue || 1;
                    return (
                      <div key={r.roomId} className={styles.revenueItem}>
                        <span className={styles.revRoom}>{r.roomName}</span>
                        <div className={styles.revBar}>
                          <div className={styles.revFill} style={{ width: `${(r.revenue / max) * 100}%` }} />
                        </div>
                        <span className={styles.revNum}>${r.revenue.toLocaleString()}</span>
                        <span className={styles.revBk}>{r.bookings} stays</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent bookings */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>Recent Bookings</div>
                <table className={styles.table}>
                  <thead><tr><th>Code</th><th>Guest</th><th>Suite</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id}>
                        <td className={styles.code}>{b.confirmationCode}</td>
                        <td>{b.guestName}</td>
                        <td>{b.roomName}</td>
                        <td className={styles.muted}>{b.checkIn} → {b.checkOut}</td>
                        <td className={styles.gold}>${b.totalPrice.toLocaleString()}</td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── BOOKINGS ──────────────────────────────────────────────── */}
          {!loading && activeTab === 'Bookings' && (
            <div>
              <div className={styles.filterRow}>
                <input className={styles.searchInput} placeholder="Search by name, email, or code..." value={bookingFilter} onChange={e => setBookingFilter(e.target.value)} />
                <span className={styles.countBadge}>{bookings.length} results</span>
              </div>
              <table className={styles.table}>
                <thead><tr><th>Code</th><th>Guest</th><th>Suite</th><th>Check-In</th><th>Check-Out</th><th>Nights</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className={styles.code}>{b.confirmationCode}</td>
                      <td><div>{b.guestName}</div><div className={styles.muted}>{b.guestEmail}</div></td>
                      <td>{b.roomName}</td>
                      <td className={styles.muted}>{b.checkIn}</td>
                      <td className={styles.muted}>{b.checkOut}</td>
                      <td>{b.nights}</td>
                      <td className={styles.gold}>${b.totalPrice.toLocaleString()}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td>
                        <div className={styles.actionBtns}>
                          {b.status === 'confirmed' && <button className={styles.actionBtn} onClick={() => updateBookingStatus(b.id, 'completed')}>✓ Complete</button>}
                          {b.status === 'confirmed' && <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => updateBookingStatus(b.id, 'cancelled')}>✕ Cancel</button>}
                          {b.status === 'confirmed' && <button className={`${styles.actionBtn} ${styles.actionWarn}`} onClick={() => updateBookingStatus(b.id, 'no-show')}>No-Show</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── DINING ────────────────────────────────────────────────── */}
          {!loading && activeTab === 'Dining' && (
            <div>
              <div className={styles.filterRow}>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                  <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Date Filter:</label>
                  <input className={styles.searchInput} type="date" value={diningDate} onChange={e => setDiningDate(e.target.value)} style={{ maxWidth: 200 }} />
                </div>
                <span className={styles.countBadge}>{dining.length} reservations</span>
              </div>
              <table className={styles.table}>
                <thead><tr><th>Code</th><th>Guest</th><th>Date</th><th>Time</th><th>Table</th><th>Party</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {dining.map(d => (
                    <tr key={d.id}>
                      <td className={styles.code}>{d.confirmationCode}</td>
                      <td><div>{d.guestName}</div><div className={styles.muted}>{d.guestEmail}</div></td>
                      <td className={styles.muted}>{d.date}</td>
                      <td>{d.time}</td>
                      <td>#{d.tableNumber}</td>
                      <td>{d.partySize} guests</td>
                      <td><StatusBadge status={d.status} /></td>
                      <td>
                        <div className={styles.actionBtns}>
                          {d.status === 'confirmed' && <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => updateDiningStatus(d.id, 'cancelled')}>✕ Cancel</button>}
                          {d.status === 'confirmed' && <button className={`${styles.actionBtn} ${styles.actionWarn}`} onClick={() => updateDiningStatus(d.id, 'no-show')}>No-Show</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── ROOMS ─────────────────────────────────────────────────── */}
          {!loading && activeTab === 'Rooms' && (
            <div className={styles.roomsGrid}>
              {rooms.map(room => {
                const rev = revenue.find(r => r.roomId === room.id);
                return (
                  <div key={room.id} className={styles.roomAdminCard}>
                    <div className={styles.roomCardTop} style={{ background: room.bgColor }}>
                      <span style={{ fontSize: 40 }}>{room.emoji}</span>
                      <span className={`${styles.availTag} ${room.available ? styles.availOpen : styles.availClosed}`}>
                        {room.available ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    <div className={styles.roomCardBody}>
                      <div className={styles.roomCardTier}>{room.tier}</div>
                      <div className={styles.roomCardName}>{room.name}</div>
                      <div className={styles.roomCardStats}>
                        <span>{rev?.bookings || 0} bookings</span>
                        <span className={styles.gold}>${(rev?.revenue || 0).toLocaleString()}</span>
                      </div>

                      {/* Price editor */}
                      <div className={styles.priceEditor}>
                        <span className={styles.priceLabel}>Rate / night:</span>
                        {editingPrice[room.id] !== undefined ? (
                          <div className={styles.priceInputRow}>
                            <input className={styles.priceInput} type="number" value={editingPrice[room.id]} onChange={e => setEditingPrice(p => ({ ...p, [room.id]: e.target.value }))} />
                            <button className={styles.actionBtn} onClick={() => savePrice(room.id)}>Save</button>
                            <button className={styles.actionBtn} onClick={() => setEditingPrice(p => { const n = { ...p }; delete n[room.id]; return n; })}>✕</button>
                          </div>
                        ) : (
                          <div className={styles.priceDisplay}>
                            <span className={styles.gold}>${room.pricePerNight.toLocaleString()}</span>
                            <button className={styles.actionBtn} onClick={() => setEditingPrice(p => ({ ...p, [room.id]: room.pricePerNight }))}>Edit</button>
                          </div>
                        )}
                      </div>

                      <button
                        className={`btn btn-sm ${room.available ? 'btn-outline' : 'btn-gold-outline'} btn-full`}
                        onClick={() => toggleRoomAvailability(room.id, room.available)}
                        style={{ marginTop: '0.8rem' }}
                      >
                        <span>{room.available ? 'Close for Booking' : 'Open for Booking'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── GUESTS ────────────────────────────────────────────────── */}
          {!loading && activeTab === 'Guests' && (
            <div>
              <table className={styles.table}>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Tier</th><th>Points</th><th>Member Since</th><th>Card ID</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td className={styles.muted}>{u.email}</td>
                      <td><span className={u.role === 'admin' ? styles.roleAdmin : styles.roleGuest}>{u.role}</span></td>
                      <td className={styles.gold}>{u.loyaltyTier}</td>
                      <td>{u.loyaltyPoints.toLocaleString()}</td>
                      <td className={styles.muted}>{u.memberSince}</td>
                      <td className={styles.code}>{u.cardId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
