import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { checkAndAlarm } from '../utils/notifications';

export default function GlobalAlarm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [alarmRevision, setAlarmRevision] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const check = () => checkAndAlarm(setAlarmRevision);
    
    // Check initially and then every 30 seconds
    check();
    intervalRef.current = setInterval(check, 30000);

    return () => clearInterval(intervalRef.current);
  }, [token]);

  if (!alarmRevision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            padding: '2rem',
            borderRadius: '24px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏰</div>
          <h2 style={{ fontSize: '24px', color: '#1a1a2e', marginBottom: '8px' }}>Time to Revise!</h2>
          <p style={{ color: '#555', marginBottom: '24px', fontSize: '16px' }}>
            <strong>{alarmRevision.problem.title}</strong> is due for a revision right now.
          </p>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => setAlarmRevision(null)}
              style={{
                padding: '10px 20px', borderRadius: '12px', border: 'none',
                background: '#f0f0f8', color: '#555', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                setAlarmRevision(null);
                navigate(`/problem/${alarmRevision.problem._id}`);
              }}
              style={{
                padding: '10px 20px', borderRadius: '12px', border: 'none',
                background: '#534AB7', color: '#fff', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(83,74,183,0.3)'
              }}
            >
              Start Revision
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
