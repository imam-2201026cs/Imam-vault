import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { playAlarmSound } from '../utils/notifications';
import PageTransition from '../components/PageTransition';
import { TypeAnimation } from 'react-type-animation';

const diffBg    = { Easy:'#EAF3DE', Medium:'#FAEEDA', Hard:'#FCEBEB' };
const diffColor = { Easy:'#27500A', Medium:'#633806', Hard:'#791F1F' };

export default function TodayRevisions() {
  const [revisions, setRevisions]       = useState([]);
  const [confidence, setConfidence]     = useState({});
  const [alarmRevision, setAlarmRevision] = useState(null);
  const [darkMode, setDarkMode]         = useState(() => localStorage.getItem('darkMode') === 'true');
  const alarmCheckerRef = useRef(null);
  const navigate = useNavigate();

  const load = () => API.get('/revisions/today').then(r => setRevisions(r.data));

  useEffect(() => {
    load();
    // Check every 30s for due revisions and ring alarm
    alarmCheckerRef.current = setInterval(() => {
      API.get('/revisions/today').then(r => {
        const now = new Date();
        const due = r.data.find(rev => {
          if (rev.completed) return false;
          const diff = Math.abs(new Date(rev.scheduledAt) - now);
          return diff < 60000;
        });
        if (due && !document.hidden) {
          playAlarmSound();
          setAlarmRevision(due);
          toast(`⏰ Time to revise: ${due.problem.title}`, { duration: 8000, icon: '🔔' });
        }
        setRevisions(r.data);
      });
    }, 30000);
    return () => clearInterval(alarmCheckerRef.current);
  }, []);

  // Dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleComplete = async (revId, e) => {
    e.stopPropagation();
    const conf = confidence[revId] || 3;
    await API.put(`/revisions/${revId}/complete`, { confidence: conf });
    toast.success('Great job! Marked as revised.');
    if (alarmRevision?._id === revId) setAlarmRevision(null);
    load();
  };

  const pending   = revisions.filter(r => !r.completed);
  const completed = revisions.filter(r => r.completed);

  const dm = darkMode;

  return (
    <>
      <style>{`
        .today-page { max-width:760px; margin:0 auto; padding:1.5rem 1rem; }
        .today-heading { font-size:22px; font-weight:700; color:${dm?'#e8e8f8':'#1a1a2e'}; margin-bottom:4px; }
        .today-sub { font-size:14px; color:${dm?'#aaa':'#888'}; margin-bottom:24px; }
        .today-section-label { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
        .today-card { background: ${dm?'rgba(30,30,46,0.7)':'rgba(255,255,255,0.45)'}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border:1px solid ${dm?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.5)'}; border-radius:16px; padding:1rem 1.25rem; margin-bottom:10px; display:flex; justify-content:space-between; align-items:flex-start; cursor:pointer; gap:12px; transition:all .25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .today-card:hover { border-color: ${dm?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.8)'}; box-shadow: 0 8px 24px rgba(83,74,183,.1); transform: translateY(-3px); background: ${dm?'rgba(40,40,60,0.8)':'rgba(255,255,255,0.6)'}; }
        .today-card-left { flex:1; min-width:0; }
        .today-card-right { flex-shrink:0; text-align:right; }
        .today-title { font-size:15px; font-weight:600; color:${dm?'#e8e8f8':'#1a1a2e'}; }
        .today-meta { font-size:12px; color:${dm?'#aaa':'#888'}; margin-top:4px; }
        .today-time { font-size:13px; color:#534AB7; font-weight:600; }
        .today-actions { display:flex; align-items:center; gap:8px; margin-top:10px; flex-wrap:wrap; }
        .today-conf-select { padding:5px 8px; border-radius:6px; border:1px solid ${dm?'#444':'#ddd'}; font-size:12px; background:${dm?'#2a2a3e':'#fff'}; color:${dm?'#e8e8f8':'#333'}; }
        .today-done-btn { padding:6px 14px; border-radius:8px; background:#EAF3DE; color:#27500A; border:1px solid #C0DD97; font-size:12px; cursor:pointer; font-weight:600; white-space:nowrap; }
        .today-badge { font-size:11px; padding:2px 8px; border-radius:99px; margin-left:6px; }
        .today-empty { text-align:center; padding:3rem 1rem; color:${dm?'#aaa':'#aaa'}; background:${dm?'#1e1e2e':'#fff'}; border-radius:12px; border:1px solid ${dm?'#333':'#e8e8f0'}; }
        .alarm-banner { background:linear-gradient(135deg,#FFF7E6,#FEF3C7); border:2px solid #F59E0B; border-radius:12px; padding:14px 18px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; animation:pulse 1s ease-in-out infinite alternate; }
        @keyframes pulse { from { box-shadow:0 0 0 0 rgba(245,158,11,.3); } to { box-shadow:0 0 0 8px rgba(245,158,11,0); } }
        .alarm-text { font-size:15px; font-weight:700; color:#92400E; }
        .alarm-btn { padding:8px 16px; border-radius:8px; background:#F59E0B; color:#fff; border:none; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap; }
        .today-topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
        .dark-toggle { padding:6px 14px; border-radius:8px; background:${dm?'#534AB7':'#f4f4ff'}; color:${dm?'#fff':'#534AB7'}; border:1px solid ${dm?'#534AB7':'#ddd'}; font-size:13px; font-weight:600; cursor:pointer; }
        body[data-theme='dark'] { background:#0f0f1a; }
        @media (max-width: 480px) {
          .today-card { flex-direction:column; }
          .today-card-right { text-align:left; }
          .today-conf-select { width:100%; }
        }
      `}</style>
      <PageTransition>
      <div className="today-page" style={{ background: dm ? '#0f0f1a' : 'transparent', minHeight: '90vh', transition:'background .3s' }}>
        <div className="today-topbar">
          <h2 className="today-heading">
            <TypeAnimation sequence={["Today's revisions", 3000, "What's up for today?", 3000, "Time to focus", 3000]} wrapper="span" cursor={true} repeat={Infinity} />
          </h2>
          <button className="dark-toggle" onClick={() => setDarkMode(d => !d)}>
            {dm ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <p className="today-sub">{new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>

        {alarmRevision && (
          <div className="alarm-banner">
            <span className="alarm-text">⏰ Time to revise: {alarmRevision.problem.title}</span>
            <button className="alarm-btn" onClick={() => { navigate(`/problem/${alarmRevision.problem._id}`); setAlarmRevision(null); }}>
              Start now →
            </button>
          </div>
        )}

        {pending.length === 0 && completed.length === 0 && (
          <div className="today-empty">
            <p style={{ fontSize:16, marginBottom:4 }}>Nothing scheduled for today</p>
            <p style={{ fontSize:13 }}>Go to a problem and schedule a revision</p>
          </div>
        )}

        {pending.length > 0 && (
          <>
            <p className="today-section-label" style={{ color:'#854F0B' }}>Pending ({pending.length})</p>
            {pending.map(r => (
              <div key={r._id} className="today-card" style={{ borderLeft:'3px solid #534AB7' }}
                onClick={() => navigate(`/problem/${r.problem._id}`)}>
                <div className="today-card-left">
                  <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:4 }}>
                    <span className="today-title">{r.problem.title}</span>
                    <span className="today-badge" style={{ background:diffBg[r.problem.difficulty], color:diffColor[r.problem.difficulty] }}>
                      {r.problem.difficulty}
                    </span>
                  </div>
                  <p className="today-meta">{r.problem.platform} · {r.problem.tags?.slice(0,3).join(', ')}</p>
                  <div className="today-actions" onClick={e => e.stopPropagation()}>
                    <select className="today-conf-select" value={confidence[r._id] || 3}
                      onChange={e => setConfidence(c => ({ ...c, [r._id]: Number(e.target.value) }))}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star — {['Very low','Low','Okay','Good','Perfect'][n-1]}</option>)}
                    </select>
                    <button className="today-done-btn" onClick={e => handleComplete(r._id, e)}>Mark done ✓</button>
                  </div>
                </div>
                <div className="today-card-right">
                  <span className="today-time">
                    {new Date(r.scheduledAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {completed.length > 0 && (
          <>
            <p className="today-section-label" style={{ color:'#3B6D11', marginTop:20 }}>Completed ({completed.length})</p>
            {completed.map(r => (
              <div key={r._id} className="today-card" style={{ opacity:0.7 }}
                onClick={() => navigate(`/problem/${r.problem._id}`)}>
                <div className="today-card-left">
                  <p className="today-title" style={{ textDecoration:'line-through', color:'#aaa' }}>{r.problem.title}</p>
                  <p className="today-meta">Confidence: {'★'.repeat(r.confidence || 0)}{'☆'.repeat(5 - (r.confidence || 0))}</p>
                </div>
                <span style={{ fontSize:12, background:'#EAF3DE', color:'#27500A', padding:'4px 10px', borderRadius:99, fontWeight:600, flexShrink:0 }}>Done</span>
              </div>
            ))}
          </>
        )}
      </div>
      </PageTransition>
    </>
  );
}
