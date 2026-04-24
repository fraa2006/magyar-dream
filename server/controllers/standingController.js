import Match from '../models/Match.js';
import Season from '../models/Season.js';
import League from '../models/League.js';
import Player from '../models/Player.js';

// Calcola la classifica partendo dai risultati delle partite
export const getStandings = async (req, res, next) => {
  try {
    const { leagueSlug, seasonName } = req.params;

    const league = await League.findOne({ slug: leagueSlug });
    if (!league) {
      return res.status(404).json({ message: 'Lega non trovata' });
    }

    // Cerco la stagione: quella richiesta o quella attiva
    const seasonQuery = { league: league._id };
    if (seasonName) {
      seasonQuery.name = seasonName;
    } else {
      seasonQuery.active = true;
    }

    const season = await Season.findOne(seasonQuery);
    if (!season) {
      return res.status(404).json({ message: 'Stagione non trovata' });
    }

    const matches = await Match.find({
      league: league._id,
      season: season._id,
      status: 'finished',
    }).populate('homeTeam awayTeam', 'name shortName logo primaryColor');

    // Costruisco la classifica riga per riga
    const table = {};

    function initTeam(team) {
      if (!table[team._id]) {
        table[team._id] = {
          team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          form: [],
        };
      }
    }

    for (const match of matches) {
      const { homeTeam, awayTeam, homeScore, awayScore } = match;

      initTeam(homeTeam);
      initTeam(awayTeam);

      const home = table[homeTeam._id];
      const away = table[awayTeam._id];

      home.played++;
      away.played++;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.won++;
        home.points += 3;
        home.form.push('W');
        away.lost++;
        away.form.push('L');
      } else if (homeScore < awayScore) {
        away.won++;
        away.points += 3;
        away.form.push('W');
        home.lost++;
        home.form.push('L');
      } else {
        home.drawn++;
        home.points += 1;
        home.form.push('D');
        away.drawn++;
        away.points += 1;
        away.form.push('D');
      }
    }

    const standings = Object.values(table)
      .map((row) => ({
        ...row,
        goalDiff: row.goalsFor - row.goalsAgainst,
        form: row.form.slice(-5),
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
        return b.goalsFor - a.goalsFor;
      });

    res.json({ league, season, standings });
  } catch (err) {
    next(err);
  }
};

export const getTopScorers = async (req, res, next) => {
  try {
    const { leagueSlug, seasonName } = req.params;

    const league = await League.findOne({ slug: leagueSlug });
    if (!league) return res.status(404).json({ message: 'Lega non trovata' });

    const seasonQuery = { league: league._id };
    if (seasonName) seasonQuery.name = seasonName;
    else seasonQuery.active = true;

    const season = await Season.findOne(seasonQuery);
    if (!season) return res.status(404).json({ message: 'Stagione non trovata' });

    const matches = await Match.find({
      league: league._id,
      season: season._id,
      status: 'finished',
    }).populate('events.player', 'firstName lastName').populate('events.team', 'name shortName');

    const scorers = {};
    for (const match of matches) {
      for (const ev of match.events) {
        if (ev.type !== 'goal' || !ev.player) continue;
        const pid = ev.player._id.toString();
        if (!scorers[pid]) {
          scorers[pid] = { player: ev.player, team: ev.team, goals: 0 };
        }
        scorers[pid].goals++;
      }
    }

    const list = Object.values(scorers).sort((a, b) => b.goals - a.goals);

    const enriched = await Promise.all(
      list.map(async (row) => {
        const fullPlayer = await Player.findById(row.player._id).populate('team', 'name shortName logo primaryColor');
        return { player: fullPlayer, goals: row.goals };
      })
    );

    res.json({ league, season, scorers: enriched });
  } catch (err) {
    next(err);
  }
};
