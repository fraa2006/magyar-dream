import Match from '../models/Match.js';

const TEAM_FIELDS = 'name shortName logo primaryColor';

export const getMatches = async (req, res, next) => {
  try {
    const { league, season, matchday, status, team, from, to, limit = 50 } = req.query;

    const filter = {};

    if (league) filter.league = league;
    if (season) filter.season = season;
    if (matchday) filter.matchday = Number(matchday);
    if (status) filter.status = status;

    if (team) {
      filter.$or = [{ homeTeam: team }, { awayTeam: team }];
    }

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const matches = await Match.find(filter)
      .sort({ date: 1, matchday: 1 })
      .limit(Number(limit))
      .populate('homeTeam awayTeam', TEAM_FIELDS)
      .populate('league', 'name shortName slug')
      .populate('season', 'name');

    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const getMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam awayTeam', `${TEAM_FIELDS} city stadium`)
      .populate('league', 'name shortName slug')
      .populate('season', 'name')
      .populate('events.team', 'name shortName')
      .populate('events.player events.player2', 'firstName lastName number');

    if (!match) {
      return res.status(404).json({ message: 'Partita non trovata' });
    }

    res.json(match);
  } catch (err) {
    next(err);
  }
};

export const createMatch = async (req, res, next) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    next(err);
  }
};

export const updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('homeTeam awayTeam', TEAM_FIELDS)
      .populate('league', 'name shortName slug');

    if (!match) {
      return res.status(404).json({ message: 'Partita non trovata' });
    }

    res.json(match);
  } catch (err) {
    next(err);
  }
};

export const deleteMatch = async (req, res, next) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Partita eliminata' });
  } catch (err) {
    next(err);
  }
};
