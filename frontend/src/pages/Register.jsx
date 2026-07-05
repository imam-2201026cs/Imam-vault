import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';

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

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/google', { access_token: tokenResponse.access_token });
      login(res.data.token);
      toast.success('Google sign-up successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Google sign-up failed');
    }
    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google Sign-Up failed'),
  });

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
        .google-btn { display:flex; align-items:center; gap:10px; padding:10px 20px; border-radius:50px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.07); color:#fff; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; width:100%; justify-content:center; }
        .google-btn:hover { background:rgba(255,255,255,0.13); border-color:rgba(255,255,255,0.3); }
        .google-btn:disabled { opacity:.6; cursor:not-allowed; }
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
            <button className="google-btn" onClick={() => googleLogin()} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
              Sign up with Google
            </button>
          </div>
          <div className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
