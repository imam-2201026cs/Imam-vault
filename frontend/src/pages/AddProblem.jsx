import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import PageTransition from '../components/PageTransition';
import { TypeAnimation } from 'react-type-animation';

const PLATFORMS = ['LeetCode', 'GFG', 'HackerRank', 'Codeforces', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddProblem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', platform: 'LeetCode', difficulty: 'Medium',
    tags: '', url: '', notes: '', approach: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await API.post('/problems', payload);
      toast.success('Problem added!');
      navigate(`/problem/${res.data._id}`);
    } catch { toast.error('Failed to add problem'); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .add-page { max-width:640px; margin:0 auto; padding:1.5rem 1rem; }
        .add-heading { font-size:22px; font-weight:800; color:#1a1a2e; margin-bottom:20px; letter-spacing:-.5px; }
        .add-card { background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.6); border-radius:16px; padding:1.75rem; box-shadow: 0 8px 32px rgba(0,0,0,0.05); }
        .add-label { font-size:12px; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; display:block; }
        .add-input { width:100%; padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); font-size:14px; margin-bottom:16px; outline:none; font-family:inherit; box-sizing:border-box; transition:all .2s; }
        .add-input:focus { border-color:#534AB7; background: rgba(255,255,255,0.8); box-shadow:0 0 0 3px rgba(83,74,183,.08); }
        .add-textarea { resize:vertical; min-height:90px; line-height:1.6; }
        .add-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .add-select-group { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
        .add-select-btn { padding:7px 16px; border-radius:99px; font-size:13px; border:1px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); cursor:pointer; font-weight:500; transition:all .2s; }
        .add-select-btn:hover { background: rgba(255,255,255,0.9); }
        .add-select-btn.active-platform { background: rgba(230, 241, 251, 0.8); color:#0C447C; border-color:#b3d4f5; }
        .add-select-btn.active-easy { background:#EAF3DE; color:#27500A; border-color:#C0DD97; }
        .add-select-btn.active-medium { background:#FAEEDA; color:#633806; border-color:#f5c896; }
        .add-select-btn.active-hard { background:#FCEBEB; color:#791F1F; border-color:#f5a5a5; }
        .add-btn { width:100%; padding:12px; border-radius:10px; background:#534AB7; color:#fff; border:none; font-size:15px; font-weight:700; cursor:pointer; margin-top:4px; transition:opacity .15s; }
        .add-btn:hover { opacity:.92; }
        .add-btn:disabled { opacity:.6; cursor:not-allowed; }
        @media (max-width: 480px) {
          .add-card { padding:1.25rem; }
          .add-row { grid-template-columns:1fr; }
        }
      `}</style>
      <PageTransition>
      <div className="add-page">
        <h2 className="add-heading">
          <TypeAnimation sequence={['Add Problem', 2000, 'Keep grinding!', 2000, 'Add Problem', 5000]} wrapper="span" cursor={true} repeat={Infinity} />
        </h2>
        <div className="add-card">
          <label className="add-label">Problem title *</label>
          <input className="add-input" placeholder="e.g. Two Sum" value={form.title}
            onChange={e => set('title', e.target.value)} />

          <label className="add-label">Platform</label>
          <div className="add-select-group">
            {PLATFORMS.map(p => (
              <button key={p} className={`add-select-btn${form.platform === p ? ' active-platform' : ''}`}
                onClick={() => set('platform', p)}>{p}</button>
            ))}
          </div>

          <label className="add-label">Difficulty</label>
          <div className="add-select-group">
            {DIFFICULTIES.map(d => (
              <button key={d} className={`add-select-btn${form.difficulty === d ? ` active-${d.toLowerCase()}` : ''}`}
                onClick={() => set('difficulty', d)}>{d}</button>
            ))}
          </div>

          <label className="add-label">Tags (comma-separated)</label>
          <input className="add-input" placeholder="e.g. Array, Binary Search, DP"
            value={form.tags} onChange={e => set('tags', e.target.value)} />

          <label className="add-label">Problem URL</label>
          <input className="add-input" placeholder="https://leetcode.com/problems/..."
            value={form.url} onChange={e => set('url', e.target.value)} />

          <label className="add-label">My approach</label>
          <textarea className="add-input add-textarea" placeholder="Describe your solution approach..."
            value={form.approach} onChange={e => set('approach', e.target.value)} />

          <label className="add-label">Notes</label>
          <textarea className="add-input add-textarea" placeholder="Key observations, edge cases..."
            value={form.notes} onChange={e => set('notes', e.target.value)} />

          <button className="add-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Problem'}
          </button>
        </div>
      </div>
      </PageTransition>
    </>
  );
}
