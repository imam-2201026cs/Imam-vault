import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/today', label: '📅 Today' },
    { to: '/analytics', label: '📊 Analytics' },
    { to: '/add', label: '+ Add Problem' },
  ];

  return (
    <>
      <style>{`
        .navbar { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.6); padding:0 1rem; position:sticky; top:0; z-index:100; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05); }
        .navbar-inner { max-width:960px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:54px; }
        .navbar-brand { font-size:20px; font-weight:800; color:#4a3fb3; text-decoration:none; letter-spacing:-.5px; }
        .navbar-links { display:flex; gap:4px; align-items:center; }
        .nav-link { padding:6px 14px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; color:#444; transition:all .2s; white-space:nowrap; }
        .nav-link:hover { background: rgba(255, 255, 255, 0.7); color:#534AB7; }
        .nav-link.active { background: rgba(255, 255, 255, 0.9); color:#534AB7; font-weight:600; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .nav-logout { padding:6px 14px; border-radius:8px; font-size:14px; font-weight:500; color:#888; background:none; border:none; cursor:pointer; transition:all .2s; }
        .nav-logout:hover { background: rgba(255, 240, 240, 0.8); color:#e24b4a; }
        .nav-hamburger { display:none; background:none; border:none; cursor:pointer; padding:6px; font-size:22px; color:#534AB7; }
        .nav-mobile-menu { display:none; flex-direction:column; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-top:1px solid rgba(255,255,255,0.6); padding:8px 1rem 16px; }
        .nav-mobile-menu.open { display:flex; }
        .nav-mobile-link { padding:10px 0; font-size:15px; font-weight:500; color:#444; text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.4); }
        .nav-mobile-link.active { color:#534AB7; font-weight:700; }
        .nav-mobile-logout { padding:10px 0; font-size:15px; color:#e24b4a; background:none; border:none; cursor:pointer; text-align:left; }
        @media (max-width: 680px) {
          .navbar-links { display:none; }
          .nav-hamburger { display:block; }
          .nav-mobile-menu { display:none; flex-direction:column; }
          .nav-mobile-menu.open { display:flex; }
        }
      `}</style>
      <nav className="navbar">
        <div className="navbar-inner">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="navbar-brand">ReviseIt</Link>
          </motion.div>
          <div className="navbar-links">
            {navLinks.map(l => (
              <motion.div key={l.to} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link to={l.to} className={`nav-link${isActive(l.to) ? ' active' : ''}`}>{l.label}</Link>
              </motion.div>
            ))}
            {token && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <button className="nav-logout" onClick={handleLogout}>Logout</button>
              </motion.div>
            )}
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(l => (
          <Link key={l.to} to={l.to} className={`nav-mobile-link${isActive(l.to) ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}>{l.label}</Link>
        ))}
        {token && <button className="nav-mobile-logout" onClick={handleLogout}>Logout</button>}
      </div>
    </>
  );
}
