const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

const LEAGUES = {
  nb1: { id: 271, name: 'Nemzeti Bajnokság I', short: 'NB I', season: 2024 },
  nb2: { id: 272, name: 'Nemzeti Bajnokság II', short: 'NB II', season: 2024 },
  u19: { id: 895, name: 'U19 Liga', short: 'U19', season: 2024 },
};

const NB1_STATIC = {
  league: { name: 'Nemzeti Bajnokság I', short: 'NB I' },
  season: '2024/25',
  standings: [
    { rank: 1,  team: { id: 1001, name: 'ETO FC Győr',           logo: '' }, all: { played: 31, win: 18, draw: 9,  lose: 4,  goals: { for: 60, against: 30 } }, goalsDiff: 30,  points: 63, form: 'DWWWW' },
    { rank: 2,  team: { id: 1002, name: 'Ferencvárosi TC',        logo: '' }, all: { played: 31, win: 19, draw: 5,  lose: 7,  goals: { for: 59, against: 31 } }, goalsDiff: 28,  points: 62, form: 'WLWWW' },
    { rank: 3,  team: { id: 1003, name: 'Debreceni VSC',          logo: '' }, all: { played: 31, win: 13, draw: 11, lose: 7,  goals: { for: 47, against: 35 } }, goalsDiff: 12,  points: 50, form: 'DWDLD' },
    { rank: 4,  team: { id: 1004, name: 'Zalaegerszegi TE FC',    logo: '' }, all: { played: 31, win: 13, draw: 9,  lose: 9,  goals: { for: 48, against: 37 } }, goalsDiff: 11,  points: 48, form: 'LWLWW' },
    { rank: 5,  team: { id: 1005, name: 'Paksi FC',               logo: '' }, all: { played: 31, win: 13, draw: 8,  lose: 10, goals: { for: 55, against: 43 } }, goalsDiff: 12,  points: 47, form: 'LWLWW' },
    { rank: 6,  team: { id: 1006, name: 'Puskás Akadémia FC',     logo: '' }, all: { played: 31, win: 12, draw: 6,  lose: 13, goals: { for: 38, against: 40 } }, goalsDiff: -2,  points: 42, form: 'WLLLW' },
    { rank: 7,  team: { id: 1007, name: 'Újpest FC',              logo: '' }, all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 47, against: 50 } }, goalsDiff: -3,  points: 40, form: 'LWWDL' },
    { rank: 8,  team: { id: 1008, name: 'Kisvárda FC',            logo: '' }, all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 35, against: 46 } }, goalsDiff: -11, points: 40, form: 'LLDLD' },
    { rank: 9,  team: { id: 1009, name: 'Nyíregyháza Spartacus',  logo: '' }, all: { played: 31, win: 10, draw: 8,  lose: 13, goals: { for: 44, against: 54 } }, goalsDiff: -10, points: 38, form: 'WLWLW' },
    { rank: 10, team: { id: 1010, name: 'MTK Budapest FC',        logo: '' }, all: { played: 31, win: 9,  draw: 9,  lose: 13, goals: { for: 52, against: 59 } }, goalsDiff: -7,  points: 36, form: 'DWWDL' },
    { rank: 11, team: { id: 1011, name: 'Diósgyőri VTK',         logo: '' }, all: { played: 31, win: 6,  draw: 10, lose: 15, goals: { for: 38, against: 58 } }, goalsDiff: -20, points: 28, form: 'WLLLL' },
    { rank: 12, team: { id: 1012, name: 'FC Kazincbarcika',       logo: '' }, all: { played: 31, win: 5,  draw: 3,  lose: 23, goals: { for: 27, against: 67 } }, goalsDiff: -40, points: 18, form: 'DLLLL' },
  ],
};

export const getLiveStandings = async (req, res) => {
  const { leagueKey } = req.params;
  const league = LEAGUES[leagueKey];
  if (!league) return res.status(404).json({ message: 'Lega non trovata' });

  if (leagueKey === 'nb1') return res.json(NB1_STATIC);

  const cacheKey = `standings_${leagueKey}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  try {
    const url = `https://v3.football.api-sports.io/standings?league=${league.id}&season=${league.season}`;
    const response = await fetch(url, { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY } });
    const json = await response.json();
    const standings = json.response?.[0]?.league?.standings?.[0] || [];
    const result = { league: { name: league.name, short: league.short }, standings, season: league.season };
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Errore API esterna', error: err.message });
  }
};

export const getLiveLeagues = (_req, res) => {
  res.json(Object.entries(LEAGUES).map(([key, l]) => ({ key, name: l.name, short: l.short })));
};
