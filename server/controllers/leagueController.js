import League from '../models/League.js';
import Season from '../models/Season.js';

export const getLeagues = async (_req, res, next) => {
  try {
    const leagues = await League.find({ active: true }).sort('tier');
    res.json(leagues);
  } catch (err) { next(err); }
};

export const getLeague = async (req, res, next) => {
  try {
    const league = await League.findOne({ slug: req.params.slug });
    if (!league) return res.status(404).json({ message: 'Lega non trovata' });
    const seasons = await Season.find({ league: league._id }).sort('-startDate');
    res.json({ league, seasons });
  } catch (err) { next(err); }
};

export const createLeague = async (req, res, next) => {
  try {
    const league = await League.create(req.body);
    res.status(201).json(league);
  } catch (err) { next(err); }
};

export const updateLeague = async (req, res, next) => {
  try {
    const league = await League.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!league) return res.status(404).json({ message: 'Lega non trovata' });
    res.json(league);
  } catch (err) { next(err); }
};

export const getSeasons = async (req, res, next) => {
  try {
    const league = await League.findOne({ slug: req.params.slug });
    if (!league) return res.status(404).json({ message: 'Lega non trovata' });
    const seasons = await Season.find({ league: league._id }).sort('-startDate');
    res.json(seasons);
  } catch (err) { next(err); }
};

export const createSeason = async (req, res, next) => {
  try {
    const season = await Season.create(req.body);
    res.status(201).json(season);
  } catch (err) { next(err); }
};
