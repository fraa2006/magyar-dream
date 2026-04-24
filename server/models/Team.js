import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  shortName:      { type: String, required: true },
  city:           { type: String, required: true },
  founded:        { type: Number },
  stadium:        { type: String, default: '' },
  capacity:       { type: Number },
  logo:           { type: String, default: '' },
  primaryColor:   { type: String, default: '#000000' },
  secondaryColor: { type: String, default: '#FFFFFF' },
  website:        { type: String, default: '' },
  leagues:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
  active:         { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
