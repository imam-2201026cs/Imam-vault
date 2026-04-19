import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

export default function Landing() {
  return (
    <div className="landing-container">
      <style>{`
        .landing-container { min-height:100vh; color:#1a1a2e; }
        .hero-section { min-height:90vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:2rem; }
        .hero-title { font-size:clamp(2.5rem, 8vw, 4.5rem); font-weight:900; letter-spacing:-2px; line-height:1.1; margin-bottom:1.5rem; color:#1a1a2e; }
        .hero-subtitle { font-size:clamp(1rem, 4vw, 1.25rem); color:#475569; max-width:600px; margin-bottom:2.5rem; line-height:1.6; }
        .gradient-text { background: linear-gradient(90deg, #534AB7, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .cta-group { display:flex; gap:16px; flex-wrap:wrap; justify-content:center; }
        .btn-primary { padding:14px 32px; border-radius:14px; background:#534AB7; color:#fff; font-weight:700; text-decoration:none; font-size:16px; transition:all 0.2s; box-shadow:0 10px 25px rgba(83, 74, 183, 0.3); }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 15px 30px rgba(83, 74, 183, 0.4); background:#443ba1; }
        .btn-secondary { padding:14px 32px; border-radius:14px; background:rgba(255,255,255,0.4); backdrop-filter:blur(10px); border:1px solid rgba(83,74,183,0.1); color:#534AB7; font-weight:700; text-decoration:none; font-size:16px; transition:all 0.2s; }
        .btn-secondary:hover { background:rgba(255,255,255,0.6); transform:translateY(-2px); }

        .features-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; max-width:1100px; margin:4rem auto; padding:0 1rem; }
        .feature-card { background:rgba(255,255,255,0.4); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.6); padding:2rem; border-radius:24px; box-shadow:0 4px 30px rgba(0,0,0,0.04); transition:transform 0.3s; }
        .feature-card:hover { transform:translateY(-10px); }
        .feature-icon { width:48px; height:48px; background:rgba(83,74,183,0.1); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#534AB7; margin-bottom:20px; }
        .feature-title { font-size:1.25rem; font-weight:800; margin-bottom:12px; }
        .feature-desc { color:#64748b; font-size:0.95rem; line-height:1.6; }

        .demo-section { padding:4rem 1rem; text-align:center; }
        .demo-card { max-width:500px; margin:0 auto; background:#fff; border-radius:20px; padding:24px; text-align:left; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border:1px solid #f1f5f9; }
        .demo-tag { display:inline-block; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:700; background:#ecfdf5; color:#059669; margin-bottom:12px; }
      `}</style>
      
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Master your Interviews with <br />
            <span className="gradient-text">
              <TypeAnimation 
                sequence={['Spaced Repetition', 2000, 'Smart Tracking', 2000, 'ReviseIt', 5000]}
                repeat={Infinity}
              />
            </span>
          </h1>
          <p className="hero-subtitle">
            Don't just solve problems—remember them. ReviseIt helps you track your DSA journey and reminds you when it's time to revise.
          </p>
          <div className="cta-group">
            <Link to="/register" className="btn-primary">Get Started for Free</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </motion.div>
      </section>

      <motion.section 
        className="features-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">Smart Scheduling</h3>
          <p className="feature-desc">Our algorithm calculates the perfect time to revisit a problem based on its difficulty and your performance.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Data-Backed Insights</h3>
          <p className="feature-desc">Visualize your progress with detailed analytics on difficulty distribution and revision consistency.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔥</div>
          <h3 className="feature-title">Gamified Motivation</h3>
          <p className="feature-desc">Keep your streak alive and watch your proficiency grow as you build a daily habit of consistent revision.</p>
        </div>
      </motion.section>

      <section className="demo-section">
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>How it works</h2>
        <motion.div 
          className="demo-card"
          whileHover={{ scale: 1.02 }}
        >
          <span className="demo-tag">MEDIUM</span>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: 700 }}>33. Search in Rotated Sorted Array</h4>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Last revised: 2 days ago</p>
          <div style={{ marginTop: '16px', height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
            <div style={{ width: '65%', height: '100%', background: '#534AB7', borderRadius: '4px' }}></div>
          </div>
          <p style={{ marginTop: '12px', fontSize: '13px', fontWeight: 600, color: '#534AB7' }}>Scheduled for: Tomorrow 🔔</p>
        </motion.div>
      </section>

      <footer style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
        © {new Date().getFullYear()} ReviseIt. Build your dream career.
      </footer>
    </div>
  );
}
