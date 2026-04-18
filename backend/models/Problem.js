import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  platform:    { type: String, enum: ['LeetCode','GFG','HackerRank','Codeforces','Other'], default: 'LeetCode' },
  difficulty:  { type: String, enum: ['Easy','Medium','Hard'], default: 'Medium' },
  tags:        [String],
  url:         { type: String, default: '' },
  notes:       { type: String, default: '' },
  approach:    { type: String, default: '' },
  solvedOn:    { type: Date, default: Date.now },
  // Spaced Repetition fields
  nextReview:  { type: Date, default: null },
  interval:    { type: Number, default: 1 },   // days until next review
  easeFactor:  { type: Number, default: 2.5 }, // SM-2 ease factor
  repetitions: { type: Number, default: 0 },   // number of successful revisions
}, { timestamps: true });

export default mongoose.model('Problem', ProblemSchema);
