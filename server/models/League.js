import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  shortName: { type: String, required: true },
  slug:      { type: String, required: true, unique: true },
  tier:      { type: Number, required: true, min: 1 },
  logo:      { type: String, default: '' },
  country:   { type: String, default: 'HU' },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('League', leagueSchema);
