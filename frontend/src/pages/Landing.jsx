import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Secure Entry",
      desc: "Start your coding journey with a beautiful, secure authentication experience.",
      img: "/assets/login_step.png",
      url: "https://reviseit.app/login"
    },
    {
      title: "Centralized Dashboard",
      desc: "Get a bird's-eye view of your progress, streaks, and upcoming revisions.",
      img: "/assets/dashboard_step.png",
      url: "https://reviseit.app/dashboard"
    },
    {
      title: "Smart Problem Adding",
      desc: "Add problems with tags, difficulty levels, and personalized approach notes.",
      img: "/assets/add_problem_step.png",
      url: "https://reviseit.app/add-problem"
    },
    {
      title: "Powerful Analytics",
      desc: "Visualize your growth with advanced charts and consistency tracking.",
      img: "/assets/analytics_step.png",
      url: "https://reviseit.app/analytics"
    },
    {
      title: "Daily Focus",
      desc: "Stay on top of what matters most with personalized daily revision goals.",
      img: "/assets/today_step.png",
      url: "https://reviseit.app/today"
    }
  ];

  return (
    <div className="landing-container">
      <style>{`
        .landing-container { min-height:100vh; color:#1a1a2e; font-family: 'Inter', sans-serif; }
        .hero-section { min-height:90vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:2rem; background: radial-gradient(circle at top right, rgba(83,74,183,0.05), transparent); }
        .hero-title { font-size:clamp(2.5rem, 8vw, 4.5rem); font-weight:900; letter-spacing:-2px; line-height:1.1; margin-bottom:1.5rem; color:#1a1a2e; }
        .hero-subtitle { font-size:clamp(1rem, 4vw, 1.25rem); color:#475569; max-width:600px; margin:0 auto 2.5rem; line-height:1.6; }
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

        .demo-section { padding:6rem 1rem; text-align:center; background:#f8fafc; }
        
        .showcase-grid { display:grid; grid-template-columns: 1fr 1.8fr; gap:4rem; max-width:1200px; margin:0 auto; text-align:left; align-items:center; }
        @media (max-width: 1024px) { .showcase-grid { grid-template-columns: 1fr; gap:3rem; } }
        
        .step-list { display:flex; flex-direction:column; gap:16px; }
        .step-card { padding:28px; border-radius:20px; cursor:pointer; transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border:1px solid transparent; background:rgba(255,255,255,0.3); }
        .step-card.active { background:#fff; border-color:#e2e8f0; box-shadow:0 15px 40px rgba(0,0,0,0.08); transform: scale(1.02) translateX(10px); }
        .step-number { width:32px; height:32px; background:rgba(83,74,183,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#534AB7; margin-bottom:12px; }
        .step-card.active .step-number { background:#534AB7; color:#fff; }
        .step-title { font-size:1.2rem; font-weight:800; margin-bottom:8px; color:#1a1a2e; }
        .step-desc { font-size:0.95rem; color:#64748b; line-height:1.6; }
        
        .browser-mockup { background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 50px 120px rgba(0,0,0,0.18); border:1px solid #e2e8f0; position:relative; }
        .browser-header { background:#f8fafc; padding:16px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #e2e8f0; }
        .dot { width:12px; height:12px; border-radius:50%; }
        .dot-red { background:#ff5f56; }
        .dot-yellow { background:#ffbd2e; }
        .dot-green { background:#27c93f; }
        .address-bar { background:#fff; flex:1; height:28px; border-radius:8px; border:1px solid #e2e8f0; margin-left:14px; display:flex; align-items:center; padding:0 14px; font-size:12px; color:#94a3b8; font-family:monospace; }
        .browser-screenshot { width:100%; display:block; aspect-ratio: 16/10; object-fit: cover; }
      `}</style>
      
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
            <span style={{ fontWeight: 700, color: '#534AB7' }}>Solve. Track. Master.</span><br />
            Accelerate your coding career with a data-driven approach to Data Structures and Algorithms. 
            Our automated spaced-repetition system ensures you never forget a concept again.
          </p>
          <div className="cta-group">
            <Link to="/register" className="btn-primary">Start Your Journey</Link>
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
          <p className="feature-desc">Our intelligent algorithm calculates the optimal time to revisit problems based on their difficulty so you revise only when needed.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Data-Backed Insights</h3>
          <p className="feature-desc">Visualize your growth with advanced analytics. Track your mastery over time and identify weak spots in your preparation.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔔</div>
          <h3 className="feature-title">Seamless Reminders</h3>
          <p className="feature-desc">Stay on top of your goals with automated <strong>Email Notifications</strong> and <strong>Smart Alarms</strong>. We keep you accountable every day.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔥</div>
          <h3 className="feature-title">Proven Consistency</h3>
          <p className="feature-desc">Build a rock-solid habit with gamified streaks. Maintain your momentum and turn coding preparation into a daily winning routine.</p>
        </div>
      </motion.section>

      <section className="demo-section">
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ marginBottom: '4rem', fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, color: '#1a1a2e', textAlign: 'center' }}>
              Master Your <span className="gradient-text">Workflow</span>
            </h2>
          </motion.div>
          
          <div className="showcase-grid">
            <div className="step-list">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`step-card ${activeStep === idx ? 'active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="step-number">{idx + 1}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="browser-mockup">
              <div className="browser-header">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <div className="address-bar">{steps[activeStep].url}</div>
              </div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={steps[activeStep].img}
                  alt={steps[activeStep].title}
                  className="browser-screenshot"
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.02, x: -20 }}
                  transition={{ duration: 0.5, ease: "anticipate" }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '14px', borderTop: '1px solid #f1f5f9' }}>
        © {new Date().getFullYear()} ReviseIt. Build your dream career.
      </footer>
    </div>
  );
}
