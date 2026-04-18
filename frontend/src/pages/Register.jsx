import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password) return toast.error('Fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/google', { credential: credentialResponse.credential });
      login(res.data.token);
      toast.success('Google sign-up successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Google sign-up failed');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background: url('/dsa-bg.png') center/cover no-repeat fixed; color:#fff; }
        .auth-card { background:rgba(15, 20, 30, 0.7); backdrop-filter:blur(20px); border:1px solid rgba(255, 255, 255, 0.1); border-radius:20px; padding:2.5rem 2rem; width:100%; max-width:400px; box-shadow:0 8px 32px rgba(0,0,0,0.5); }
        .auth-logo { font-size:28px; font-weight:800; color:#4ade80; margin-bottom:6px; text-shadow: 0 0 10px rgba(74,222,128,0.3); }
        .auth-sub { font-size:14px; color:#a0aec0; margin-bottom:28px; }
        .auth-label { font-size:12px; font-weight:700; color:#cbd5e1; text-transform:uppercase; letter-spacing:.05em; margin-bottom:6px; display:block; }
        .auth-input { width:100%; padding:11px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); font-size:14px; margin-bottom:16px; outline:none; box-sizing:border-box; background:rgba(255,255,255,0.05); color:#fff; }
        .auth-input::placeholder { color:#64748b; }
        .auth-input:focus { border-color:#4ade80; box-shadow:0 0 0 3px rgba(74,222,128,0.15); background:rgba(255,255,255,0.08); }
        .password-group { position:relative; margin-bottom:16px; }
        .password-group .auth-input { margin-bottom:0; padding-right:40px; }
        .pwd-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#a0aec0; cursor:pointer; padding:0; display:flex; align-items:center; }
        .pwd-toggle:hover { color:#fff; }
        .auth-btn { width:100%; padding:12px; border-radius:10px; background:#4ade80; color:#0f172a; border:none; font-size:15px; font-weight:700; cursor:pointer; margin-top:4px; transition:all 0.2s; }
        .auth-btn:hover { background:#22c55e; box-shadow:0 0 15px rgba(74,222,128,0.4); }
        .auth-btn:disabled { opacity:.6; cursor:not-allowed; }
        .auth-footer { text-align:center; margin-top:20px; font-size:13px; color:#a0aec0; }
        .auth-link { color:#4ade80; font-weight:600; text-decoration:none; }
        .google-wrapper { margin-top: 16px; display: flex; justify-content: center; }
        .divider { display: flex; align-items: center; text-align: center; margin: 20px 0; color: #64748b; font-size: 13px; }
        .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .divider:not(:empty)::before { margin-right: .5em; }
        .divider:not(:empty)::after { margin-left: .5em; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">ReviseIt</div>
          <p className="auth-sub">Create your account and start revising smarter.</p>
          <input className="auth-input" placeholder="Name"
            value={name} onChange={e => setName(e.target.value)} />
          <input className="auth-input" type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <div className="password-group">
            <input className="auth-input" type={showPassword ? "text" : "password"} placeholder="Password (Min 6 chars)"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          
          <div className="divider">or</div>
          
          <div className="google-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google Sign-Up failed')}
              theme="filled_black"
              shape="pill"
              text="signup_with"
            />
          </div>
          <div className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
