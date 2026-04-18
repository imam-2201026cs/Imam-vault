import mongoose from 'mongoose';

const RevisionSchema = new mongoose.Schema({
  problem:     { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  notified:    { type: Boolean, default: false },
  completed:   { type: Boolean, default: false },
  confidence:  { type: Number, min: 1, max: 5, default: null },
}, { timestamps: true });

export default mongoose.model('Revision', RevisionSchema);
