import { useEffect, useState } from 'react';
import API from '../api/axios';

const BAR_COLORS = ['#534AB7','#7C75CC','#A9A4DE','#CCC9EE'];

function BarChart({ data, maxVal, color }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:100 }}>
      {data.map((item, i) => {
        const pct = maxVal ? (item.count / maxVal) * 100 : 0;
        return (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:4 }}>
            <span style={{ fontSize:10, color:'#888' }}>{item.count || ''}</span>
            <div style={{ width:'100%', height:`${Math.max(pct,2)}%`, background:pct>0?color:'#f0f0f8', borderRadius:'4px 4px 0 0', minHeight:4, transition:'height .4s' }}></div>
            <span style={{ fontSize:9, color:'#999', textAlign:'center', lineHeight:1.2 }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get('/revisions/analytics'),
      API.get('/auth/profile'),
    ]).then(([ar, pr]) => {
      setData(ar.data);
      setProfile(pr.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding:'2rem', color:'#aaa', textAlign:'center' }}>Loading analytics...</div>;
  if (!data) return null;

  const weekDays = data.weekActivity.map(w => ({
    label: new Date(w.date).toLocaleDateString('en-IN', { weekday:'short' }),
    count: w.count,
  }));
  const maxWeek = Math.max(...weekDays.map(d => d.count), 1);

  const diffData = [
    { label:'Easy', count: data.byDiff.Easy, color:'#27500A', bg:'#EAF3DE' },
    { label:'Medium', count: data.byDiff.Medium, color:'#633806', bg:'#FAEEDA' },
    { label:'Hard', count: data.byDiff.Hard, color:'#791F1F', bg:'#FCEBEB' },
  ];

  const platEntries = Object.entries(data.byPlatform).sort((a,b) => b[1] - a[1]);
  const maxPlat = Math.max(...platEntries.map(e => e[1]), 1);

  return (
    <>
      <style>{`
        .analytics-page { max-width:900px; margin:0 auto; padding:1.5rem 1rem; }
        .analytics-heading { font-size:22px; font-weight:700; color:#1a1a2e; margin-bottom:20px; }
        .analytics-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:24px; }
        .an-stat { background:#f8f9fa; border-radius:12px; padding:16px; }
        .an-stat-num { font-size:28px; font-weight:800; color:#534AB7; line-height:1; }
        .an-stat-lbl { font-size:12px; color:#888; margin-top:4px; }
        .an-card { background:#fff; border:1px solid #e8e8f0; border-radius:14px; padding:1.25rem; margin-bottom:16px; }
        .an-card-title { font-size:14px; font-weight:700; color:#534AB7; margin-bottom:14px; text-transform:uppercase; letter-spacing:.05em; }
        .an-progress-bar { height:10px; border-radius:99px; background:#f0f0f8; overflow:hidden; margin-bottom:6px; }
        .an-progress-fill { height:100%; border-radius:99px; transition:width .5s; }
        .an-diff-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .an-diff-label { font-size:13px; font-weight:600; width:60px; }
        .an-diff-count { font-size:13px; color:#888; margin-left:auto; }
        .an-plat-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .an-plat-label { font-size:13px; font-weight:500; width:100px; color:#444; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .streak-card { background:linear-gradient(135deg,#FFF7E6,#FEF3C7); border:1px solid #FCD34D; }
        @media (max-width: 480px) {
          .analytics-grid { grid-template-columns:repeat(2,1fr); }
        }
      `}</style>
      <div className="analytics-page">
        <h2 className="analytics-heading">📊 Progress Analytics</h2>

        <div className="analytics-grid">
          <div className="an-stat">
            <div className="an-stat-num">{data.completed}</div>
            <div className="an-stat-lbl">Total revised</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-num">{data.completionRate}%</div>
            <div className="an-stat-lbl">Completion rate</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-num">{data.avgConfidence ?? '—'}</div>
            <div className="an-stat-lbl">Avg confidence ★</div>
          </div>
          <div className="an-stat streak-card">
            <div className="an-stat-num" style={{ color:'#D97706' }}>{profile?.currentStreak || 0} 🔥</div>
            <div className="an-stat-lbl">Current streak</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-num" style={{ color:'#D97706' }}>{profile?.longestStreak || 0}</div>
            <div className="an-stat-lbl">Longest streak</div>
          </div>
          <div className="an-stat">
            <div className="an-stat-num">{data.pending}</div>
            <div className="an-stat-lbl">Pending revisions</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="an-card">
          <p className="an-card-title">Last 7 days activity</p>
          <BarChart data={weekDays} maxVal={maxWeek} color="#534AB7" />
        </div>

        {/* Difficulty Breakdown */}
        <div className="an-card">
          <p className="an-card-title">By difficulty</p>
          {diffData.map(d => (
            <div key={d.label} className="an-diff-row">
              <span className="an-diff-label" style={{ color: d.color }}>{d.label}</span>
              <div style={{ flex:1 }}>
                <div className="an-progress-bar">
                  <div className="an-progress-fill" style={{
                    width: data.completed ? `${(d.count / data.completed) * 100}%` : '0%',
                    background: d.bg === '#EAF3DE' ? '#27500A' : d.bg === '#FAEEDA' ? '#D97706' : '#e24b4a'
                  }}></div>
                </div>
              </div>
              <span className="an-diff-count">{d.count}</span>
            </div>
          ))}
        </div>

        {/* Platform Breakdown */}
        {platEntries.length > 0 && (
          <div className="an-card">
            <p className="an-card-title">By platform</p>
            {platEntries.map(([plat, count], i) => (
              <div key={plat} className="an-plat-row">
                <span className="an-plat-label">{plat}</span>
                <div style={{ flex:1 }}>
                  <div className="an-progress-bar">
                    <div className="an-progress-fill" style={{
                      width: `${(count / maxPlat) * 100}%`,
                      background: BAR_COLORS[i % BAR_COLORS.length]
                    }}></div>
                  </div>
                </div>
                <span style={{ fontSize:13, color:'#888', marginLeft:8 }}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
