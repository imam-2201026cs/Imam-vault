import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const PRESETS = [
  { label: 'Tomorrow', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
];

export default function RevisionModal({ problemId, problemTitle, onClose, onScheduled }) {
  const [date, setDate]       = useState('');
  const [time, setTime]       = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);

  const schedule = async () => {
    if (!date) return toast.error('Pick a date');
    setLoading(true);
    try {
      await API.post('/revisions', { problemId, scheduledAt: new Date(`${date}T${time}`) });
      toast.success('Revision scheduled!');
      onScheduled(); onClose();
    } catch { toast.error('Failed to schedule'); }
    setLoading(false);
  };

  const autoSchedule = async () => {
    setAutoLoading(true);
    try {
      await API.post('/revisions/auto-schedule', { problemId });
      toast.success('Auto-scheduled using Spaced Repetition!');
      onScheduled(); onClose();
    } catch { toast.error('Auto-schedule failed'); }
    setAutoLoading(false);
  };

  const setPreset = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <>
      <style>{`
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.35); z-index:200; display:flex; align-items:center; justify-content:center; padding:1rem; }
        .modal { background:#fff; border-radius:16px; padding:1.75rem; width:100%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,.15); }
        .modal-title { font-size:18px; font-weight:700; color:#1a1a2e; margin-bottom:4px; }
        .modal-sub { font-size:13px; color:#888; margin-bottom:20px; }
        .modal-label { font-size:12px; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; }
        .modal-input { width:100%; padding:10px 12px; border-radius:8px; border:1px solid #ddd; font-size:14px; margin-bottom:14px; box-sizing:border-box; outline:none; }
        .modal-input:focus { border-color:#534AB7; }
        .modal-presets { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
        .modal-preset { padding:5px 12px; border-radius:99px; font-size:12px; border:1px solid #ddd; cursor:pointer; background:#f8f9fa; font-weight:500; }
        .modal-preset:hover { background:#EEEDFE; border-color:#534AB7; color:#534AB7; }
        .modal-row { display:flex; gap:10px; margin-bottom:14px; }
        .modal-row .modal-input { margin-bottom:0; }
        .modal-actions { display:flex; gap:8px; margin-top:6px; }
        .modal-btn { flex:1; padding:10px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; border:none; }
        .modal-btn-primary { background:#534AB7; color:#fff; }
        .modal-btn-secondary { background:#f4f4ff; color:#534AB7; border:1px solid #d0d0f0; }
        .modal-btn-auto { width:100%; padding:12px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; border:none; background:linear-gradient(135deg,#534AB7,#7C75CC); color:#fff; margin-bottom:12px; }
        .modal-divider { display:flex; align-items:center; gap:10px; margin:14px 0; }
        .modal-divider-line { flex:1; height:1px; background:#e8e8f0; }
        .modal-divider-text { font-size:12px; color:#aaa; }
        @media (max-width: 480px) {
          .modal { padding:1.25rem; }
          .modal-row { flex-direction:column; }
        }
      `}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <p className="modal-title">Schedule Revision</p>
          <p className="modal-sub">{problemTitle}</p>

          <button className="modal-btn-auto" onClick={autoSchedule} disabled={autoLoading}>
            {autoLoading ? 'Scheduling...' : '🧠 Auto-schedule with Spaced Repetition'}
          </button>
          <p style={{ fontSize:11, color:'#888', textAlign:'center', marginBottom:4 }}>
            Automatically picks the optimal review date based on your performance
          </p>

          <div className="modal-divider">
            <div className="modal-divider-line"></div>
            <span className="modal-divider-text">or pick manually</span>
            <div className="modal-divider-line"></div>
          </div>

          <p className="modal-label">Quick pick</p>
          <div className="modal-presets">
            {PRESETS.map(p => (
              <button key={p.days} className="modal-preset" onClick={() => setPreset(p.days)}>{p.label}</button>
            ))}
          </div>

          <div className="modal-row">
            <div style={{ flex:2 }}>
              <p className="modal-label">Date</p>
              <input type="date" className="modal-input" value={date} onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div style={{ flex:1 }}>
              <p className="modal-label">Time</p>
              <input type="time" className="modal-input" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="modal-actions">
            <button className="modal-btn modal-btn-secondary" onClick={onClose}>Cancel</button>
            <button className="modal-btn modal-btn-primary" onClick={schedule} disabled={loading}>
              {loading ? 'Saving...' : 'Schedule'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
