import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  type:    { type: String, enum: ['goal', 'yellow_card', 'red_card', 'substitution'], required: true },
  minute:  { type: Number, required: true },
  team:    { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  player:  { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
}, { _id: false });

const matchSchema = new mongoose.Schema({
  homeTeam:  { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam:  { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  league:    { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  season:    { type: mongoose.Schema.Types.ObjectId, ref: 'Season', required: true },
  matchday:  { type: Number, required: true },
  date:      { type: Date, required: true },
  venue:     { type: String, default: '' },
  status:    { type: String, enum: ['scheduled', 'live', 'finished', 'postponed'], default: 'scheduled' },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
  events:    [eventSchema],
}, { timestamps: true });

matchSchema.index({ league: 1, season: 1, matchday: 1 });
matchSchema.index({ date: 1 });
matchSchema.index({ homeTeam: 1 });
matchSchema.index({ awayTeam: 1 });

export default mongoose.model('Match', matchSchema);
