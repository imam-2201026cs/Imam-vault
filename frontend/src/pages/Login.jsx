import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token);        // ✅ pass only token
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background:#f8f9ff; }
        .auth-card { background:#fff; border:1px solid #e8e8f0; border-radius:20px; padding:2.5rem 2rem; width:100%; max-width:400px; box-shadow:0 4px 24px rgba(83,74,183,.07); }
        .auth-logo { font-size:28px; font-weight:800; color:#534AB7; margin-bottom:6px; }
        .auth-sub { font-size:14px; color:#888; margin-bottom:28px; }
        .auth-label { font-size:12px; font-weight:700; color:#555; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; display:block; }
        .auth-input { width:100%; padding:11px 14px; border-radius:8px; border:1px solid #ddd; font-size:14px; margin-bottom:16px; outline:none; box-sizing:border-box; }
        .auth-input:focus { border-color:#534AB7; box-shadow:0 0 0 3px rgba(83,74,183,.08); }
        .auth-btn { width:100%; padding:12px; border-radius:10px; background:#534AB7; color:#fff; border:none; font-size:15px; font-weight:700; cursor:pointer; margin-top:4px; }
        .auth-btn:hover { opacity:.92; }
        .auth-btn:disabled { opacity:.6; cursor:not-allowed; }
        .auth-footer { text-align:center; margin-top:20px; font-size:13px; color:#888; }
        .auth-link { color:#534AB7; font-weight:600; text-decoration:none; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">ReviseIt</div>
          <p className="auth-sub">Welcome back! Sign in to continue.</p>
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="you@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}