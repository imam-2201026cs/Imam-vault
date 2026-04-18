import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import ProblemCard from '../components/ProblemCard';
import { requestNotificationPermission, subscribeToPush } from '../utils/notifications';
import PageTransition from '../components/PageTransition';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

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
        .dash-notif-banner { background: rgba(238, 237, 254, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border:1px solid rgba(175, 169, 236, 0.5); border-radius:12px; padding:12px 16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .dash-notif-text { font-size:13px; color:#3C3489; flex:1; min-width:180px; font-weight:500; }
        .dash-notif-btn { font-size:13px; padding:7px 16px; border-radius:8px; background: rgba(83, 74, 183, 0.9); color:#fff; border:none; cursor:pointer; font-weight:600; white-space:nowrap; transition:all .2s; }
        .dash-notif-btn:hover { background: #534AB7; transform: translateY(-1px); }
        .dash-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:24px; }
        .dash-stat { background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.6); border-radius:16px; padding:16px; box-shadow: 0 4px 30px rgba(0,0,0,0.04); transition:transform .2s; }
        .dash-stat:hover { transform: translateY(-3px); }
        .dash-stat-num { font-size:28px; font-weight:800; color:#4a3fb3; line-height:1; }
        .dash-stat-lbl { font-size:13px; color:#666; font-weight:500; margin-top:6px; }
        .dash-topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:10px; flex-wrap:wrap; min-height:30px; }
        .dash-heading { font-size:22px; font-weight:800; color:#1a1a2e; letter-spacing:-0.5px; }
        .dash-controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
        .dash-search { padding:10px 16px; border-radius:12px; border:1px solid rgba(255,255,255,0.6); font-size:14px; width:100%; max-width:200px; outline:none; background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); transition:all .2s; }
        .dash-search:focus { background: rgba(255,255,255,0.8); border-color:#534AB7; box-shadow:0 0 0 3px rgba(83,74,183,0.1); }
        .dash-sort { padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.6); font-size:14px; outline:none; background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); cursor:pointer; font-weight:500; transition:all .2s; }
        .dash-sort:focus { background: rgba(255,255,255,0.8); }
        .dash-filters { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
        .dash-filter { padding:6px 16px; border-radius:99px; font-size:14px; border:1px solid rgba(255,255,255,0.6); cursor:pointer; font-weight:600; transition:all .2s; background: rgba(255,255,255,0.4); backdrop-filter: blur(8px); color:#555; }
        .dash-filter:hover { background: rgba(255,255,255,0.8); }
        .dash-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px; }
        .dash-empty { text-align:center; padding:4rem 1rem; color:#888; background:rgba(255,255,255,0.3); border-radius:16px; backdrop-filter:blur(10px); border:1px dashed rgba(255,255,255,0.6); }
        .streak-stat { background:linear-gradient(135deg, rgba(255, 247, 230, 0.7), rgba(254, 243, 199, 0.7)); border:1px solid rgba(252, 211, 77, 0.5); }
        .streak-num { color:#D97706 !important; }
        @media (max-width: 480px) {
          .dash-search { max-width:100%; }
          .dash-topbar { flex-direction:column; align-items:flex-start; }
          .dash-controls { width:100%; }
          .dash-search, .dash-sort { flex:1; max-width:none; }
          .dash-grid { grid-template-columns:1fr; }
        }
      `}</style>
      <PageTransition>
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
          <div className="dash-stat" style={{ background: todayCount > 0 ? 'rgba(250, 238, 218, 0.7)' : undefined }}>
            <div className="dash-stat-num" style={{ color: todayCount > 0 ? '#854F0B' : '#534AB7' }}>{todayCount}</div>
            <div className="dash-stat-lbl">Due today</div>
          </div>
          <div className={`dash-stat streak-stat`}>
            <div className="dash-stat-num streak-num">{streak} 🔥</div>
            <div className="dash-stat-lbl">Day streak</div>
          </div>
        </div>

        <div className="dash-topbar">
          <h2 className="dash-heading">
            <TypeAnimation sequence={['My problems', 2000, 'Keep revising!', 2000, 'My problems', 5000]} wrapper="span" cursor={true} repeat={Infinity} />
          </h2>
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
              style={difficulty === d ? { background: '#534AB7', color: '#fff', borderColor: '#534AB7' } : {}}
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
      </PageTransition>
    </>
  );
}
