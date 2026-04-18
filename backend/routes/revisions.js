import { Router } from 'express';
import auth from '../middleware/auth.js';
import Revision from '../models/Revision.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

const router = Router();

// SM-2 spaced repetition algorithm
function sm2(easeFactor, repetitions, interval, quality) {
  // quality: 0-5 (we map confidence 1-5 → quality 0-4 then +1 to fit SM-2 range 0-5)
  const q = Math.max(0, quality - 1); // map 1-5 → 0-4, treat 5 as 4 for SM-2
  
  let newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newRep, newInterval;
  if (q < 3) {
    // Failed — restart
    newRep = 0;
    newInterval = 1;
  } else {
    newRep = repetitions + 1;
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * newEF);
  }

  return { easeFactor: newEF, repetitions: newRep, interval: newInterval };
}

// Schedule a revision (manual)
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, scheduledAt } = req.body;
    const revision = await Revision.create({
      problem: problemId,
      user: req.user.id,
      scheduledAt: new Date(scheduledAt),
    });
    res.json(revision);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Auto-schedule next revision using SM-2
router.post('/auto-schedule', auth, async (req, res) => {
  try {
    const { problemId } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ msg: 'Problem not found' });

    const intervals = [1, 3, 7, 14, 30]; // fallback default schedule
    const rep = problem.repetitions || 0;
    const daysUntilNext = problem.interval || intervals[Math.min(rep, intervals.length - 1)];

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + daysUntilNext);
    scheduledAt.setHours(9, 0, 0, 0); // default 9 AM

    const revision = await Revision.create({
      problem: problemId,
      user: req.user.id,
      scheduledAt,
    });
    res.json(revision);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get today's revisions
router.get('/today', auth, async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);
    const revisions = await Revision.find({
      user: req.user.id,
      scheduledAt: { $gte: start, $lte: end },
    }).populate('problem', 'title platform difficulty tags url');
    res.json(revisions);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get all upcoming revisions
router.get('/upcoming', auth, async (req, res) => {
  try {
    const revisions = await Revision.find({
      user: req.user.id,
      completed: false,
      scheduledAt: { $gte: new Date() },
    })
      .populate('problem', 'title platform difficulty tags')
      .sort({ scheduledAt: 1 });
    res.json(revisions);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Progress analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const allRevisions = await Revision.find({ user: req.user.id })
      .populate('problem', 'title platform difficulty tags');

    const completed = allRevisions.filter(r => r.completed);
    const total = allRevisions.length;

    // Weekly activity (last 7 days)
    const now = new Date();
    const weekActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
      const dayEnd   = new Date(d); dayEnd.setHours(23,59,59,999);
      const count = completed.filter(r => {
        const dt = new Date(r.updatedAt);
        return dt >= dayStart && dt <= dayEnd;
      }).length;
      weekActivity.push({ date: dayStart, count });
    }

    // Difficulty breakdown
    const byDiff = { Easy: 0, Medium: 0, Hard: 0 };
    completed.forEach(r => { if (r.problem?.difficulty) byDiff[r.problem.difficulty]++; });

    // Platform breakdown
    const byPlatform = {};
    completed.forEach(r => {
      const p = r.problem?.platform || 'Other';
      byPlatform[p] = (byPlatform[p] || 0) + 1;
    });

    // Average confidence
    const withConf = completed.filter(r => r.confidence);
    const avgConfidence = withConf.length
      ? (withConf.reduce((s, r) => s + r.confidence, 0) / withConf.length).toFixed(1)
      : null;

    // Completion rate
    const completionRate = total ? Math.round((completed.length / total) * 100) : 0;

    res.json({
      total, completed: completed.length, pending: total - completed.length,
      completionRate, weekActivity, byDiff, byPlatform, avgConfidence,
    });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Mark revision complete + SM-2 update
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const revision = await Revision.findByIdAndUpdate(
      req.params.id,
      { completed: true, confidence: req.body.confidence },
      { new: true }
    );

    // Update problem with SM-2 next interval
    const confidence = req.body.confidence || 3;
    const problem = await Problem.findById(revision.problem);
    if (problem) {
      const { easeFactor, repetitions, interval } = sm2(
        problem.easeFactor, problem.repetitions, problem.interval, confidence
      );
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      await Problem.findByIdAndUpdate(revision.problem, {
        easeFactor, repetitions, interval, nextReview
      });
    }

    // Update user streak
    const user = await User.findById(req.user.id);
    if (user) {
      const today = new Date(); today.setHours(0,0,0,0);
      const last = user.lastRevisionDate ? new Date(user.lastRevisionDate) : null;
      if (last) last.setHours(0,0,0,0);

      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
      let newStreak = user.currentStreak || 0;

      if (!last || last < yesterday) newStreak = 1;
      else if (last.getTime() === yesterday.getTime()) newStreak += 1;
      // same day: keep streak as-is

      const longestStreak = Math.max(user.longestStreak || 0, newStreak);
      await User.findByIdAndUpdate(req.user.id, {
        lastRevisionDate: new Date(),
        currentStreak: newStreak,
        longestStreak,
      });
    }

    res.json(revision);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete a revision
router.delete('/:id', auth, async (req, res) => {
  try {
    await Revision.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Revision deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

export default router;
