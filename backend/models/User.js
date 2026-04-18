import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: false },
  googleId:         { type: String, sparse: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  pushSubscription: { type: Object, default: null },
  // Streak tracking
  lastRevisionDate: { type: Date, default: null },
  currentStreak:    { type: Number, default: 0 },
  longestStreak:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
