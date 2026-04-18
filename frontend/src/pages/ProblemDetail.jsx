import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import RevisionModal from '../components/RevisionModal';

const diffColor = { Easy:'#27500A', Medium:'#633806', Hard:'#791F1F' };
const diffBg    = { Easy:'#EAF3DE', Medium:'#FAEEDA', Hard:'#FCEBEB' };

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem]       = useState(null);
  const [revisions, setRevisions]   = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [confidence, setConfidence] = useState({});

  const load = () => API.get(`/problems/${id}`).then(r => {
    setProblem(r.data.problem);
    setRevisions(r.data.revisions);
  });

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this problem and all its revisions?')) return;
    await API.delete(`/problems/${id}`);
    toast.success('Problem deleted');
    navigate('/');
  };

  const handleComplete = async (revId) => {
    const conf = confidence[revId] || 3;
    await API.put(`/revisions/${revId}/complete`, { confidence: conf });
    toast.success('Marked as revised! Next review scheduled via Spaced Repetition 🧠');
    load();
  };

  const handleDeleteRevision = async (revId) => {
    await API.delete(`/revisions/${revId}`);
    toast.success('Revision removed');
    load();
  };

  if (!problem) return <div style={{ padding:'2rem', color:'#aaa', textAlign:'center' }}>Loading...</div>;

  const upcoming = revisions.filter(r => !r.completed);
  const done     = revisions.filter(r => r.completed);

  const nextReviewDays = problem.nextReview
    ? Math.ceil((new Date(problem.nextReview) - new Date()) / (1000*60*60*24))
    : null;

  return (
    <>
      <style>{`
        .detail-page { max-width:760px; margin:0 auto; padding:1.5rem 1rem; }
        .detail-card { background:#fff; border:1px solid #e8e8f0; border-radius:16px; padding:1.75rem; margin-bottom:16px; }
        .detail-top-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; gap:12px; }
        .detail-title { font-size:22px; font-weight:700; color:#1a1a2e; margin-bottom:8px; }
        .detail-badges { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
        .detail-badge { font-size:12px; font-weight:600; padding:4px 12px; border-radius:99px; }
        .detail-tag { font-size:11px; background:#EEEDFE; color:#3C3489; padding:3px 9px; border-radius:99px; margin-right:5px; margin-bottom:4px; display:inline-block; }
        .detail-section-label { font-size:13px; font-weight:700; color:#888; margin-bottom:6px; text-transform:uppercase; letter-spacing:.06em; }
        .detail-body { font-size:14px; color:#444; line-height:1.7; white-space:pre-wrap; }
        .detail-actions { margin-top:20px; display:flex; gap:8px; flex-wrap:wrap; }
        .detail-btn { padding:9px 18px; border-radius:8px; background:#534AB7; color:#fff; border:none; font-size:14px; font-weight:600; cursor:pointer; }
        .detail-del-btn { padding:9px 18px; border-radius:8px; background:#fff; color:#e24b4a; border:1px solid #fca5a5; font-size:14px; cursor:pointer; }
        .detail-rev-item { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f5; gap:12px; flex-wrap:wrap; }
        .detail-rev-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap; }
        .detail-done-btn { padding:5px 12px; border-radius:8px; background:#EAF3DE; color:#27500A; border:1px solid #C0DD97; font-size:12px; cursor:pointer; font-weight:600; }
        .detail-del-rev-btn { padding:5px 10px; border-radius:8px; background:#fff; color:#e24b4a; border:1px solid #fca5a5; font-size:12px; cursor:pointer; }
        .detail-conf-select { padding:4px 8px; border-radius:6px; border:1px solid #ddd; font-size:12px; }
        .detail-open-link { font-size:13px; color:#534AB7; text-decoration:none; font-weight:600; flex-shrink:0; }
        .sm2-info { background:#EEEDFE; border-radius:10px; padding:12px 14px; margin-bottom:14px; font-size:13px; color:#3C3489; }
        @media (max-width: 480px) {
          .detail-card { padding:1.25rem; }
          .detail-title { font-size:18px; }
          .detail-top-row { flex-direction:column; }
          .detail-actions { flex-direction:column; }
          .detail-btn, .detail-del-btn { width:100%; text-align:center; }
          .detail-rev-actions { width:100%; }
          .detail-conf-select { flex:1; }
        }
      `}</style>
      <div className="detail-page">
        {showModal && (
          <RevisionModal problemId={id} problemTitle={problem.title}
            onClose={() => setShowModal(false)} onScheduled={load} />
        )}

        <div className="detail-card">
          <div className="detail-top-row">
            <div style={{ flex:1, minWidth:0 }}>
              <h1 className="detail-title">{problem.title}</h1>
              <div className="detail-badges">
                <span className="detail-badge" style={{ background:diffBg[problem.difficulty], color:diffColor[problem.difficulty] }}>
                  {problem.difficulty}
                </span>
                <span className="detail-badge" style={{ background:'#E6F1FB', color:'#0C447C' }}>{problem.platform}</span>
                {nextReviewDays !== null && (
                  <span className="detail-badge" style={{
                    background: nextReviewDays <= 0 ? '#FCEBEB' : '#EAF3DE',
                    color: nextReviewDays <= 0 ? '#791F1F' : '#27500A'
                  }}>
                    {nextReviewDays <= 0 ? '⚡ Due now' : `📅 Review in ${nextReviewDays}d`}
                  </span>
                )}
              </div>
              <div>{problem.tags?.map(t => <span key={t} className="detail-tag">{t}</span>)}</div>
            </div>
            {problem.url && (
              <a href={problem.url} target="_blank" rel="noreferrer" className="detail-open-link">Open ↗</a>
            )}
          </div>

          {problem.repetitions > 0 && (
            <div className="sm2-info">
              🧠 Spaced Repetition: {problem.repetitions} successful revision{problem.repetitions !== 1 ? 's' : ''} · 
              Ease factor: {problem.easeFactor?.toFixed(1)} · 
              Next interval: {problem.interval} day{problem.interval !== 1 ? 's' : ''}
            </div>
          )}

          {problem.approach && (
            <div style={{ marginTop:16 }}>
              <p className="detail-section-label">My approach</p>
              <p className="detail-body">{problem.approach}</p>
            </div>
          )}
          {problem.notes && (
            <div style={{ marginTop:16 }}>
              <p className="detail-section-label">Notes</p>
              <p className="detail-body">{problem.notes}</p>
            </div>
          )}

          <div className="detail-actions">
            <button className="detail-btn" onClick={() => setShowModal(true)}>+ Schedule Revision</button>
            <button className="detail-del-btn" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="detail-card">
          <p className="detail-section-label">Revision schedule ({revisions.length})</p>
          {revisions.length === 0 && <p style={{ color:'#aaa', fontSize:14 }}>No revisions scheduled yet. Add one above!</p>}

          {upcoming.length > 0 && (
            <>
              <p style={{ fontSize:12, fontWeight:700, color:'#854F0B', marginBottom:6, marginTop:8 }}>UPCOMING ({upcoming.length})</p>
              {upcoming.map(r => (
                <div key={r._id} className="detail-rev-item">
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#1a1a2e' }}>
                      {new Date(r.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="detail-rev-actions">
                    <select className="detail-conf-select" value={confidence[r._id] || 3}
                      onChange={e => setConfidence(c => ({ ...c, [r._id]: Number(e.target.value) }))}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} — {['Very low','Low','Okay','Good','Perfect'][n-1]}</option>)}
                    </select>
                    <button className="detail-done-btn" onClick={() => handleComplete(r._id)}>Done ✓</button>
                    <button className="detail-del-rev-btn" onClick={() => handleDeleteRevision(r._id)}>✕</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {done.length > 0 && (
            <>
              <p style={{ fontSize:12, fontWeight:700, color:'#3B6D11', marginBottom:6, marginTop:14 }}>COMPLETED ({done.length})</p>
              {done.map(r => (
                <div key={r._id} className="detail-rev-item">
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:14, color:'#aaa', textDecoration:'line-through' }}>
                      {new Date(r.scheduledAt).toLocaleString()}
                    </p>
                    {r.confidence && (
                      <p style={{ fontSize:12, color:'#888', marginTop:2 }}>
                        Confidence: {'★'.repeat(r.confidence)}{'☆'.repeat(5 - r.confidence)}
                      </p>
                    )}
                  </div>
                  <span style={{ fontSize:12, background:'#EAF3DE', color:'#27500A', padding:'4px 10px', borderRadius:99, fontWeight:600 }}>Done</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
