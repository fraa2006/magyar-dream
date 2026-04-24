import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username:      { type: String, required: true, unique: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6, select: false },
  role:          { type: String, enum: ['user', 'scout', 'admin', 'superadmin'], default: 'user' },
  name:          { type: String, trim: true },
  position:      { type: String, enum: ['GK', 'DF', 'MF', 'FW', ''], default: '' },
  bio:           { type: String, maxlength: 500, default: '' },
  isPremium:     { type: Boolean, default: false },
  premiumSince:  { type: Date },
  googleId:      { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
