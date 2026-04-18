import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
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

// Generate AI Hint
router.post('/:id/hint', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ msg: 'Problem not found' });
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_key_here') {
      return res.status(400).json({ msg: 'AI Hints are not configured on this server. Please add GEMINI_API_KEY to .env' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert coding tutor. A student is trying to solve the problem "${problem.title}" on ${problem.platform} (Difficulty: ${problem.difficulty}).
They have written the following notes about their approach: "${problem.approach || 'None provided'}".
Provide a subtle, step-by-step hint to help them get un-stuck without revealing the exact code answer. Keep it concise, engaging, and format it in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ hint: response.text });
  } catch (err) {
    console.error('AI Hint Error:', err);
    res.status(500).json({ msg: 'Failed to generate hint. Please try again later.' });
  }
});

export default router;
