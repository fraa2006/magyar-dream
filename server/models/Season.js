import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  league:    { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Season', seasonSchema);
