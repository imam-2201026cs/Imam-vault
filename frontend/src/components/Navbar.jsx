import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

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
        .navbar { background:#fff; border-bottom:1px solid #e8e8f0; padding:0 1rem; position:sticky; top:0; z-index:100; }
        .navbar-inner { max-width:960px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; height:54px; }
        .navbar-brand { font-size:18px; font-weight:800; color:#534AB7; text-decoration:none; letter-spacing:-.5px; }
        .navbar-links { display:flex; gap:4px; align-items:center; }
        .nav-link { padding:6px 14px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; color:#555; transition:background .15s, color .15s; white-space:nowrap; }
        .nav-link:hover { background:#f4f4ff; color:#534AB7; }
        .nav-link.active { background:#EEEDFE; color:#534AB7; font-weight:600; }
        .nav-logout { padding:6px 14px; border-radius:8px; font-size:14px; font-weight:500; color:#888; background:none; border:none; cursor:pointer; }
        .nav-logout:hover { background:#fff0f0; color:#e24b4a; }
        .nav-hamburger { display:none; background:none; border:none; cursor:pointer; padding:6px; font-size:22px; color:#534AB7; }
        .nav-mobile-menu { display:none; flex-direction:column; background:#fff; border-top:1px solid #e8e8f0; padding:8px 1rem 16px; }
        .nav-mobile-menu.open { display:flex; }
        .nav-mobile-link { padding:10px 0; font-size:15px; font-weight:500; color:#333; text-decoration:none; border-bottom:1px solid #f0f0f8; }
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
          <Link to="/" className="navbar-brand">ReviseIt</Link>
          <div className="navbar-links">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link${isActive(l.to) ? ' active' : ''}`}>{l.label}</Link>
            ))}
            {token && <button className="nav-logout" onClick={handleLogout}>Logout</button>}
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
