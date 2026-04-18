import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import ProblemCard from '../components/ProblemCard';
import { requestNotificationPermission, subscribeToPush } from '../utils/notifications';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function Dashboard() {
  const [problems, setProblems]         = useState([]);
  const [search, setSearch]             = useState('');
  const [difficulty, setDifficulty]     = useState('All');
  const [todayCount, setTodayCount]     = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(Notification.permission === 'granted');
  const [profile, setProfile]           = useState(null);
  const [sortBy, setSortBy]             = useState('newest');

  useEffect(() => {
    API.get('/problems').then(r => setProblems(r.data));
    API.get('/revisions/today').then(r => setTodayCount(r.data.length));
    API.get('/auth/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      const ok = await subscribeToPush();
      if (ok) { setNotifEnabled(true); toast.success('Notifications enabled!'); }
      else toast.error('Failed to enable notifications');
    } else {
      toast.error('Permission denied. Please allow notifications in browser settings.');
    }
  };

  const sorted = [...problems].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'next-review') {
      if (!a.nextReview) return 1;
      if (!b.nextReview) return -1;
      return new Date(a.nextReview) - new Date(b.nextReview);
    }
    return 0;
  });

  const filtered = sorted.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  const streak = profile?.currentStreak || 0;

  return (
    <>
      <style>{`
        .dash-page { max-width:960px; margin:0 auto; padding:1.5rem 1rem; }
        .dash-notif-banner { background:#EEEDFE; border:1px solid #AFA9EC; border-radius:10px; padding:12px 16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
        .dash-notif-text { font-size:13px; color:#3C3489; flex:1; min-width:180px; }
        .dash-notif-btn { font-size:13px; padding:7px 16px; border-radius:8px; background:#534AB7; color:#fff; border:none; cursor:pointer; font-weight:600; white-space:nowrap; }
        .dash-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:24px; }
        .dash-stat { background:#f8f9fa; border-radius:10px; padding:14px 16px; }
        .dash-stat-num { font-size:26px; font-weight:700; color:#534AB7; line-height:1; }
        .dash-stat-lbl { font-size:12px; color:#888; margin-top:4px; }
        .dash-topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:10px; flex-wrap:wrap; }
        .dash-heading { font-size:18px; font-weight:700; color:#1a1a2e; }
        .dash-controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .dash-search { padding:8px 14px; border-radius:8px; border:1px solid #ddd; font-size:14px; width:100%; max-width:200px; outline:none; }
        .dash-sort { padding:8px 12px; border-radius:8px; border:1px solid #ddd; font-size:13px; outline:none; background:#fff; cursor:pointer; }
        .dash-filters { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
        .dash-filter { padding:5px 14px; border-radius:99px; font-size:13px; border:1px solid; cursor:pointer; font-weight:500; transition:all .15s; }
        .dash-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:12px; }
        .dash-empty { text-align:center; padding:3rem 1rem; color:#aaa; }
        .streak-stat { background:linear-gradient(135deg,#FFF7E6,#FEF3C7); border:1px solid #FCD34D; }
        .streak-num { color:#D97706 !important; }
        @media (max-width: 480px) {
          .dash-search { max-width:100%; }
          .dash-topbar { flex-direction:column; align-items:flex-start; }
          .dash-controls { width:100%; }
          .dash-search, .dash-sort { flex:1; max-width:none; }
          .dash-grid { grid-template-columns:1fr; }
        }
      `}</style>
      <div className="dash-page">
        {!notifEnabled && (
          <div className="dash-notif-banner">
            <span className="dash-notif-text">🔔 Enable browser notifications to get revision reminders on time</span>
            <button className="dash-notif-btn" onClick={handleEnableNotifications}>Enable notifications</button>
          </div>
        )}

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-num">{problems.length}</div>
            <div className="dash-stat-lbl">Total problems</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-num" style={{ color:'#27500A' }}>{problems.filter(p => p.difficulty === 'Easy').length}</div>
            <div className="dash-stat-lbl">Easy</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-num" style={{ color:'#633806' }}>{problems.filter(p => p.difficulty === 'Medium').length}</div>
            <div className="dash-stat-lbl">Medium</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-num" style={{ color:'#791F1F' }}>{problems.filter(p => p.difficulty === 'Hard').length}</div>
            <div className="dash-stat-lbl">Hard</div>
          </div>
          <div className="dash-stat" style={{ background: todayCount > 0 ? '#FAEEDA' : '#f8f9fa' }}>
            <div className="dash-stat-num" style={{ color: todayCount > 0 ? '#854F0B' : '#534AB7' }}>{todayCount}</div>
            <div className="dash-stat-lbl">Due today</div>
          </div>
          <div className={`dash-stat streak-stat`}>
            <div className="dash-stat-num streak-num">{streak} 🔥</div>
            <div className="dash-stat-lbl">Day streak</div>
          </div>
        </div>

        <div className="dash-topbar">
          <h2 className="dash-heading">My problems</h2>
          <div className="dash-controls">
            <input className="dash-search" placeholder="Search title or tag..." value={search}
              onChange={e => setSearch(e.target.value)} />
            <select className="dash-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="next-review">Next review</option>
            </select>
          </div>
        </div>

        <div className="dash-filters">
          {DIFFICULTIES.map(d => (
            <button key={d} className="dash-filter"
              style={{ background: difficulty === d ? '#534AB7' : '#fff', color: difficulty === d ? '#fff' : '#555', borderColor: difficulty === d ? '#534AB7' : '#ddd' }}
              onClick={() => setDifficulty(d)}>{d}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="dash-empty">
            {problems.length === 0
              ? <><p style={{ fontSize:16, marginBottom:8 }}>No problems yet</p><Link to="/add" style={{ color:'#534AB7', fontWeight:600 }}>Add your first problem →</Link></>
              : <p>No problems match your filter</p>
            }
          </div>
        ) : (
          <div className="dash-grid">
            {filtered.map(p => <ProblemCard key={p._id} problem={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
