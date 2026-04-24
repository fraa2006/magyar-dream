import Player from '../models/Player.js';
import Match from '../models/Match.js';

export const getPlayers = async (req, res, next) => {
  try {
    const { team, position } = req.query;
    const filter = { active: true };
    if (team) filter.team = team;
    if (position) filter.position = position;
    const players = await Player.find(filter).sort('position number').populate('team', 'name shortName logo');
    res.json(players);
  } catch (err) { next(err); }
};

export const getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name shortName logo city');
    if (!player) return res.status(404).json({ message: 'Giocatore non trovato' });
    res.json(player);
  } catch (err) { next(err); }
};

export const getPlayerStats = async (req, res, next) => {
  try {
    const playerId = req.params.id;
    const matches = await Match.find({
      status: 'finished',
      $or: [{ 'events.player': playerId }, { 'events.player2': playerId }],
    }).select('events homeTeam awayTeam date');

    let goals = 0, assists = 0, yellowCards = 0, redCards = 0, matchesPlayed = 0;

    for (const match of matches) {
      let appeared = false;
      for (const ev of match.events) {
        if (ev.player?.toString() === playerId) {
          if (ev.type === 'goal') goals++;
          if (ev.type === 'yellow_card') yellowCards++;
          if (ev.type === 'red_card') redCards++;
          appeared = true;
        }
        if (ev.player2?.toString() === playerId && ev.type === 'goal') {
          assists++;
          appeared = true;
        }
      }
      if (appeared) matchesPlayed++;
    }

    res.json({ goals, assists, yellowCards, redCards, matchesPlayed });
  } catch (err) { next(err); }
};

export const createPlayer = async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (err) { next(err); }
};

export const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ message: 'Giocatore non trovato' });
    res.json(player);
  } catch (err) { next(err); }
};

export const deletePlayer = async (req, res, next) => {
  try {
    await Player.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Giocatore eliminato' });
  } catch (err) { next(err); }
};
