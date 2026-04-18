import API from '../api/axios';

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) throw new Error('Service workers not supported');
  const reg = await navigator.serviceWorker.register('/sw.js');
  return reg;
};

export const subscribeToPush = async () => {
  try {
    const reg = await registerServiceWorker();
    const { data } = await API.get('/notifications/vapid-public-key');
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });
    await API.post('/notifications/subscribe', subscription);
    return true;
  } catch (err) {
    console.error('Push subscription failed:', err);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  const permission = await Notification.requestPermission();
  return permission;
};

// Generate an alarm beep using Web Audio API
export const playAlarmSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (startTime, freq, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      osc.start(startTime);
      osc.stop(startTime + dur);
    };
    // Three ascending beeps
    playBeep(ctx.currentTime, 880, 0.15);
    playBeep(ctx.currentTime + 0.2, 1100, 0.15);
    playBeep(ctx.currentTime + 0.4, 1320, 0.25);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
};

// Check if any revision is due right now (within 1 minute) and ring alarm
export const checkAndAlarm = async (setAlarmRevision) => {
  try {
    const res = await API.get('/revisions/today');
    const now = new Date();
    const dueNow = res.data.find(r => {
      if (r.completed) return false;
      const diff = Math.abs(new Date(r.scheduledAt) - now);
      return diff < 60000; // within 1 minute
    });
    if (dueNow) {
      playAlarmSound();
      setAlarmRevision && setAlarmRevision(dueNow);
    }
  } catch (_) {}
};
