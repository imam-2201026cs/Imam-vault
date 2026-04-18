import { Router } from 'express';
import webpush from 'web-push';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Save browser push subscription
router.post('/subscribe', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { pushSubscription: req.body });
    res.json({ msg: 'Push subscription saved' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Send test notification
router.post('/test', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.pushSubscription)
      return res.status(400).json({ msg: 'No push subscription found. Enable notifications first.' });
    await webpush.sendNotification(
      user.pushSubscription,
      JSON.stringify({
        title: 'ReviseIt — Test Notification',
        body: 'Notifications are working! You will be reminded on time.',
        icon: '/logo192.png',
      })
    );
    res.json({ msg: 'Test notification sent' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Return VAPID public key to frontend
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;
