import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Match from '../models/Match.js';

export const getTeams = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.league) filter.leagues = req.query.league;
    const teams = await Team.find({ ...filter, active: true }).sort('name').populate('leagues', 'name slug');
    res.json(teams);
  } catch (err) { next(err); }
};

export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('leagues', 'name slug');
    if (!team) return res.status(404).json({ message: 'Squadra non trovata' });

    const [players, allMatches, recentMatches] = await Promise.all([
      Player.find({ team: team._id, active: true }).sort('position number'),
      Match.find({
        $or: [{ homeTeam: team._id }, { awayTeam: team._id }],
        status: 'finished',
      }).select('events'),
      Match.find({
        $or: [{ homeTeam: team._id }, { awayTeam: team._id }],
        status: 'finished',
      }).sort('-date').limit(5).populate('homeTeam awayTeam league', 'name shortName slug logo'),
    ]);

    const statsMap = {};
    for (const match of allMatches) {
      for (const ev of match.events) {
        if (ev.player) {
          const pid = ev.player.toString();
          if (!statsMap[pid]) statsMap[pid] = { goals: 0, assists: 0, yellowCards: 0, redCards: 0, matches: 0 };
          if (ev.type === 'goal') statsMap[pid].goals++;
          if (ev.type === 'yellow_card') statsMap[pid].yellowCards++;
          if (ev.type === 'red_card') statsMap[pid].redCards++;
        }
        if (ev.player2 && ev.type === 'goal') {
          const pid = ev.player2.toString();
          if (!statsMap[pid]) statsMap[pid] = { goals: 0, assists: 0, yellowCards: 0, redCards: 0, matches: 0 };
          statsMap[pid].assists++;
        }
      }
    }

    const playersWithStats = players.map((p) => ({
      ...p.toObject({ virtuals: true }),
      stats: statsMap[p._id.toString()] || { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    }));

    res.json({ team, players: playersWithStats, recentMatches });
  } catch (err) { next(err); }
};

export const createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (err) { next(err); }
};

export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!team) return res.status(404).json({ message: 'Squadra non trovata' });
    res.json(team);
  } catch (err) { next(err); }
};

export const deleteTeam = async (req, res, next) => {
  try {
    await Team.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Squadra eliminata' });
  } catch (err) { next(err); }
};
