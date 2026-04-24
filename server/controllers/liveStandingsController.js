const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 ora

const LEAGUES = {
  nb1: { id: 271, name: 'Nemzeti Bajnokság I', short: 'NB I', season: 2024 },
  nb2: { id: 272, name: 'Nemzeti Bajnokság II', short: 'NB II', season: 2024 },
  u19: { id: 895, name: 'U19 Liga', short: 'U19', season: 2024 },
};

export const getLiveStandings = async (req, res) => {
  const { leagueKey } = req.params;
  const league = LEAGUES[leagueKey];
  if (!league) return res.status(404).json({ message: 'Lega non trovata' });

  const cacheKey = `standings_${leagueKey}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  try {
    const url = `https://v3.football.api-sports.io/standings?league=${league.id}&season=${league.season}`;
    console.log(`[API-Football] GET ${url}`);
    const response = await fetch(url, { headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY } });
    const json = await response.json();
    console.log(`[API-Football] errors:`, json.errors, '| results:', json.results);
    const standings = json.response?.[0]?.league?.standings?.[0] || [];
    const result = { league: { name: league.name, short: league.short }, standings, season: league.season };
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    console.error('[API-Football] fetch error:', err.message);
    res.status(500).json({ message: 'Errore API esterna', error: err.message });
  }
};

export const getLiveLeagues = (_req, res) => {
  res.json(Object.entries(LEAGUES).map(([key, l]) => ({ key, name: l.name, short: l.short })));
};
