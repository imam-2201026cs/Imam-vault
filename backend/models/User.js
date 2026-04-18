import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: true },
  pushSubscription: { type: Object, default: null },
  // Streak tracking
  lastRevisionDate: { type: Date, default: null },
  currentStreak:    { type: Number, default: 0 },
  longestStreak:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
