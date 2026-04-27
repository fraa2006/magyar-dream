import Standings from '../models/Standings.js';
import League from '../models/League.js';

export const getLiveStandings = async (req, res) => {
  const { leagueKey } = req.params;
  try {
    const data = await Standings.findOne({ leagueSlug: leagueKey });
    if (!data) return res.status(404).json({ message: 'Classifica non trovata' });
    res.json({ league: { name: data.leagueName, short: data.leagueShort }, season: data.season, standings: data.standings });
  } catch (err) {
    res.status(500).json({ message: 'Errore DB', error: err.message });
  }
};

export const getLiveLeagues = async (_req, res) => {
  try {
    const list = await Standings.find({}, 'leagueSlug leagueName leagueShort');
    res.json(list.map(s => ({ key: s.leagueSlug, name: s.leagueName, short: s.leagueShort })));
  } catch (err) {
    res.status(500).json({ message: 'Errore DB', error: err.message });
  }
};
