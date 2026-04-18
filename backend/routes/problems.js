import { Router } from 'express';
import auth from '../middleware/auth.js';
import Problem from '../models/Problem.js';
import Revision from '../models/Revision.js';

const router = Router();

// Get all problems for user
router.get('/', auth, async (req, res) => {
  try {
    const problems = await Problem.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Add a problem
router.post('/', auth, async (req, res) => {
  try {
    const problem = await Problem.create({ ...req.body, user: req.user.id });
    res.json(problem);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get single problem with revisions
router.get('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    const revisions = await Revision.find({ problem: req.params.id }).sort({ scheduledAt: 1 });
    res.json({ problem, revisions });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Update problem
router.put('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(problem);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete problem and its revisions
router.delete('/:id', auth, async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    await Revision.deleteMany({ problem: req.params.id });
    res.json({ msg: 'Problem deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

export default router;
