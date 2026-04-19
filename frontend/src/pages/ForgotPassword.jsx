import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = request reset, 2 = verify otp and set password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async () => {
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      toast.success(res.data.msg);
      
      // If we are in Dev Mode and backend returned the OTP, auto-fill it or show it!
      if (res.data.devOtp) {
        toast.custom((t) => (
          <div style={{ background: '#333', color: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #4ade80' }}>
            <strong>Development Mode OTP:</strong>
            <h2 style={{ letterSpacing: '4px', margin: '8px 0', color: '#4ade80' }}>{res.data.devOtp}</h2>
            <p style={{fontSize: '12px', margin: 0}}>Copy this 6-digit code. (Actual emails are bypassed during dev without SMTP credentials)</p>
          </div>
        ), { duration: 10000 });
        setOtp(res.data.devOtp); // auto-fill for convenience
      }
      
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error sending reset code');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!otp || !password) return toast.error('Fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', { email, otp, password });
      toast.success(res.data.msg);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error resetting password');
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
        .auth-input { width:100%; padding:11px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); font-size:14px; margin-bottom:16px; outline:none; box-sizing:border-box; background:rgba(255,255,255,0.05); color:#fff; }
        .auth-input::placeholder { color:#64748b; }
        .auth-input:focus { border-color:#4ade80; box-shadow:0 0 0 3px rgba(74,222,128,0.15); background:rgba(255,255,255,0.08); }
        .auth-btn { width:100%; padding:12px; border-radius:10px; background:#4ade80; color:#0f172a; border:none; font-size:15px; font-weight:700; cursor:pointer; margin-top:4px; transition:all 0.2s; }
        .auth-btn:hover { background:#22c55e; box-shadow:0 0 15px rgba(74,222,128,0.4); }
        .auth-btn:disabled { opacity:.6; cursor:not-allowed; }
        .auth-footer { text-align:center; margin-top:20px; font-size:13px; color:#a0aec0; }
        .auth-link { color:#4ade80; font-weight:600; text-decoration:none; }
        .password-group { position:relative; margin-bottom:16px; }
        .password-group .auth-input { margin-bottom:0; padding-right:40px; }
        .pwd-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:#a0aec0; cursor:pointer; padding:0; display:flex; align-items:center; }
        .pwd-toggle:hover { color:#fff; }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">ReviseIt</div>
          <p className="auth-sub">
            {step === 1 ? 'Enter your email to request a reset code.' : 'Enter the code sent to your email and your new password.'}
          </p>

          {step === 1 ? (
            <>
              <input className="auth-input" type="email" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRequestReset()} />
              
              <button className="auth-btn" onClick={handleRequestReset} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </>
          ) : (
            <>
              <input className="auth-input" type="text" placeholder="6-digit Code"
                value={otp} onChange={e => setOtp(e.target.value)} />
              
              <div className="password-group">
                <input className="auth-input" type={showPassword ? "text" : "password"} placeholder="New Password (Min 6 chars)"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleResetPassword()} />
                <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
                
              <button className="auth-btn" onClick={handleResetPassword} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </>
          )}

          <div className="auth-footer">
            Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
