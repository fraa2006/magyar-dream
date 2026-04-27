import mongoose from 'mongoose';

const StandingsSchema = new mongoose.Schema({
  leagueSlug: { type: String, required: true, unique: true },
  leagueName: { type: String, required: true },
  leagueShort: { type: String, required: true },
  season: { type: String, required: true },
  standings: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Standings', StandingsSchema);
