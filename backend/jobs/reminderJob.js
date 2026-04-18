import cron from 'node-cron';
import webpush from 'web-push';
import Revision from '../models/Revision.js';
import User from '../models/User.js';

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Runs every minute — checks for revisions due in the next 60 seconds
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 30000);
    const windowEnd   = new Date(now.getTime() + 30000);

    const dueRevisions = await Revision.find({
      scheduledAt: { $gte: windowStart, $lte: windowEnd },
      notified: false,
      completed: false,
    }).populate('problem', 'title platform difficulty');

    for (const rev of dueRevisions) {
      const user = await User.findById(rev.user);
      if (user?.pushSubscription) {
        try {
          await webpush.sendNotification(
            user.pushSubscription,
            JSON.stringify({
              title: `⏰ Revise now: ${rev.problem.title}`,
              body: `${rev.problem.platform} · ${rev.problem.difficulty} — open ReviseIt and solve it again!`,
              icon: '/logo192.png',
              badge: '/logo192.png',
              url: '/today',
              sound: true,
            })
          );
          console.log(`Notification sent to user ${user.email} for: ${rev.problem.title}`);
        } catch (pushErr) {
          console.error('Push failed:', pushErr.message);
        }
      }
      rev.notified = true;
      await rev.save();
    }
  } catch (err) {
    console.error('Reminder job error:', err.message);
  }
});

console.log('Reminder cron job started — checking every minute');
