import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  dateOfBirth: { type: Date },
  nationality: { type: String, default: 'HU' },
  position:    { type: String, enum: ['GK', 'DF', 'MF', 'FW'], required: true },
  number:      { type: Number },
  photo:       { type: String, default: '' },
  team:        { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

playerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Player', playerSchema);
