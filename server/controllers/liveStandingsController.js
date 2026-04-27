const LEAGUES = [
  { key: 'nb1', name: 'Nemzeti Bajnokság I',  short: 'NB I' },
  { key: 'nb2', name: 'Nemzeti Bajnokság II', short: 'NB II' },
  { key: 'u19', name: 'U19 Nemzeti Bajnokság', short: 'U19' },
];

const STANDINGS = {
  nb1: {
    league: { name: 'Nemzeti Bajnokság I', short: 'NB I' },
    season: '2024/25',
    standings: [
      { rank: 1,  team: { name: 'ETO FC Győr' },            all: { played: 31, win: 18, draw: 9,  lose: 4,  goals: { for: 60, against: 30 } }, goalsDiff: 30,  points: 63, form: 'DWWWW' },
      { rank: 2,  team: { name: 'Ferencvárosi TC' },         all: { played: 31, win: 19, draw: 5,  lose: 7,  goals: { for: 59, against: 31 } }, goalsDiff: 28,  points: 62, form: 'WLWWW' },
      { rank: 3,  team: { name: 'Debreceni VSC' },           all: { played: 31, win: 13, draw: 11, lose: 7,  goals: { for: 47, against: 35 } }, goalsDiff: 12,  points: 50, form: 'DWDLD' },
      { rank: 4,  team: { name: 'Zalaegerszegi TE FC' },     all: { played: 31, win: 13, draw: 9,  lose: 9,  goals: { for: 48, against: 37 } }, goalsDiff: 11,  points: 48, form: 'LWLWW' },
      { rank: 5,  team: { name: 'Paksi FC' },                all: { played: 31, win: 13, draw: 8,  lose: 10, goals: { for: 55, against: 43 } }, goalsDiff: 12,  points: 47, form: 'LWLWW' },
      { rank: 6,  team: { name: 'Puskás Akadémia FC' },      all: { played: 31, win: 12, draw: 6,  lose: 13, goals: { for: 38, against: 40 } }, goalsDiff: -2,  points: 42, form: 'WLLLW' },
      { rank: 7,  team: { name: 'Újpest FC' },               all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 47, against: 50 } }, goalsDiff: -3,  points: 40, form: 'LWWDL' },
      { rank: 8,  team: { name: 'Kisvárda FC' },             all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 35, against: 46 } }, goalsDiff: -11, points: 40, form: 'LLDLD' },
      { rank: 9,  team: { name: 'Nyíregyháza Spartacus' },   all: { played: 31, win: 10, draw: 8,  lose: 13, goals: { for: 44, against: 54 } }, goalsDiff: -10, points: 38, form: 'WLWLW' },
      { rank: 10, team: { name: 'MTK Budapest FC' },         all: { played: 31, win: 9,  draw: 9,  lose: 13, goals: { for: 52, against: 59 } }, goalsDiff: -7,  points: 36, form: 'DWWDL' },
      { rank: 11, team: { name: 'Diósgyőri VTK' },          all: { played: 31, win: 6,  draw: 10, lose: 15, goals: { for: 38, against: 58 } }, goalsDiff: -20, points: 28, form: 'WLLLL' },
      { rank: 12, team: { name: 'FC Kazincbarcika' },        all: { played: 31, win: 5,  draw: 3,  lose: 23, goals: { for: 27, against: 67 } }, goalsDiff: -40, points: 18, form: 'DLLLL' },
    ],
  },
  nb2: {
    league: { name: 'Nemzeti Bajnokság II', short: 'NB II' },
    season: '2024/25',
    standings: [
      { rank: 1,  team: { name: 'Vasas SC' },               all: { played: 27, win: 18, draw: 4,  lose: 5,  goals: { for: 53, against: 20 } }, goalsDiff: 33,  points: 58, form: 'WLWWW' },
      { rank: 2,  team: { name: 'Budapest Honvéd FC' },     all: { played: 26, win: 17, draw: 3,  lose: 6,  goals: { for: 45, against: 21 } }, goalsDiff: 24,  points: 54, form: 'WLWWW' },
      { rank: 3,  team: { name: 'Kecskeméti TE' },          all: { played: 27, win: 15, draw: 3,  lose: 9,  goals: { for: 46, against: 33 } }, goalsDiff: 13,  points: 48, form: 'WWWWL' },
      { rank: 4,  team: { name: 'Mezőkövesd-Zsóry SE' },    all: { played: 27, win: 12, draw: 7,  lose: 8,  goals: { for: 35, against: 31 } }, goalsDiff: 4,   points: 43, form: 'DLWLW' },
      { rank: 5,  team: { name: 'Csákvári TK' },            all: { played: 27, win: 10, draw: 10, lose: 7,  goals: { for: 41, against: 36 } }, goalsDiff: 5,   points: 40, form: 'LWLDW' },
      { rank: 6,  team: { name: 'Videoton FC' },            all: { played: 27, win: 10, draw: 9,  lose: 8,  goals: { for: 35, against: 27 } }, goalsDiff: 8,   points: 39, form: 'LWDWD' },
      { rank: 7,  team: { name: 'Kozármisleny SE' },        all: { played: 27, win: 10, draw: 9,  lose: 8,  goals: { for: 32, against: 37 } }, goalsDiff: -5,  points: 39, form: 'WDWWD' },
      { rank: 8,  team: { name: 'Karcagi SE' },             all: { played: 27, win: 9,  draw: 8,  lose: 10, goals: { for: 28, against: 37 } }, goalsDiff: -9,  points: 35, form: 'DWLLL' },
      { rank: 9,  team: { name: 'BVSC-Zugló' },             all: { played: 27, win: 10, draw: 4,  lose: 13, goals: { for: 30, against: 28 } }, goalsDiff: 2,   points: 34, form: 'LWDLL' },
      { rank: 10, team: { name: 'Ajka FC' },                all: { played: 27, win: 10, draw: 3,  lose: 14, goals: { for: 21, against: 32 } }, goalsDiff: -11, points: 33, form: 'DDLWW' },
      { rank: 11, team: { name: 'Tiszakecske' },            all: { played: 27, win: 8,  draw: 9,  lose: 10, goals: { for: 33, against: 42 } }, goalsDiff: -9,  points: 33, form: 'LWWWD' },
      { rank: 12, team: { name: 'Szeged FC' },              all: { played: 27, win: 8,  draw: 8,  lose: 11, goals: { for: 26, against: 33 } }, goalsDiff: -7,  points: 32, form: 'LLDLW' },
      { rank: 13, team: { name: 'Soroksár SC' },            all: { played: 26, win: 6,  draw: 8,  lose: 12, goals: { for: 35, against: 43 } }, goalsDiff: -8,  points: 26, form: 'WDWLL' },
      { rank: 14, team: { name: 'Budafoki MTE' },           all: { played: 27, win: 6,  draw: 7,  lose: 14, goals: { for: 27, against: 44 } }, goalsDiff: -17, points: 25, form: 'WLLLD' },
      { rank: 15, team: { name: 'Békéscsaba 1912 Előre' },  all: { played: 27, win: 5,  draw: 10, lose: 12, goals: { for: 25, against: 38 } }, goalsDiff: -13, points: 25, form: 'DDDLD' },
      { rank: 16, team: { name: 'Szentlőrinc SE' },         all: { played: 27, win: 4,  draw: 12, lose: 11, goals: { for: 30, against: 40 } }, goalsDiff: -10, points: 24, form: 'WDLLL' },
    ],
  },
  u19: {
    league: { name: 'U19 Nemzeti Bajnokság', short: 'U19' },
    season: '2024/25',
    standings: [
      { rank: 1,  team: { name: 'Budapest Honvéd U19' },                  all: { played: 17, win: 14, draw: 1, lose: 2,  goals: { for: 53, against: 8  } }, goalsDiff: 45,  points: 43, form: 'WWWWW' },
      { rank: 2,  team: { name: 'MTK Budapest U19' },                     all: { played: 16, win: 14, draw: 0, lose: 2,  goals: { for: 51, against: 20 } }, goalsDiff: 31,  points: 42, form: 'WWWWW' },
      { rank: 3,  team: { name: 'Debreceni VSC U19' },                    all: { played: 15, win: 8,  draw: 0, lose: 7,  goals: { for: 35, against: 23 } }, goalsDiff: 12,  points: 24, form: 'WLWLW' },
      { rank: 4,  team: { name: 'Illés Akadémia Haladás U19' },          all: { played: 17, win: 6,  draw: 6, lose: 5,  goals: { for: 24, against: 27 } }, goalsDiff: -3,  points: 24, form: 'LWWDL' },
      { rank: 5,  team: { name: 'Ferencvárosi TC U19' },                 all: { played: 16, win: 7,  draw: 2, lose: 7,  goals: { for: 31, against: 34 } }, goalsDiff: -3,  points: 23, form: 'DWLWW' },
      { rank: 6,  team: { name: 'Diósgyőri VTK U19' },                  all: { played: 15, win: 6,  draw: 4, lose: 5,  goals: { for: 24, against: 24 } }, goalsDiff: 0,   points: 22, form: 'DWWLW' },
      { rank: 7,  team: { name: 'Puskás Akadémia U19' },                 all: { played: 16, win: 7,  draw: 1, lose: 8,  goals: { for: 31, against: 35 } }, goalsDiff: -4,  points: 22, form: 'LWLLL' },
      { rank: 8,  team: { name: 'Győri ETO U19' },                       all: { played: 16, win: 5,  draw: 4, lose: 7,  goals: { for: 29, against: 26 } }, goalsDiff: 3,   points: 19, form: 'DWLWL' },
      { rank: 9,  team: { name: 'Kubala Akadémia U19' },                 all: { played: 16, win: 4,  draw: 4, lose: 8,  goals: { for: 18, against: 28 } }, goalsDiff: -10, points: 16, form: 'WLDLL' },
      { rank: 10, team: { name: 'Fehérvár FC U19' },                     all: { played: 16, win: 4,  draw: 3, lose: 9,  goals: { for: 15, against: 41 } }, goalsDiff: -26, points: 15, form: 'LLLLL' },
      { rank: 11, team: { name: 'Szeged-Csanád Grosics Akadémia U19' }, all: { played: 16, win: 3,  draw: 4, lose: 9,  goals: { for: 17, against: 41 } }, goalsDiff: -24, points: 13, form: 'LLDWD' },
      { rank: 12, team: { name: 'Újpest FC U19' },                       all: { played: 16, win: 2,  draw: 3, lose: 11, goals: { for: 17, against: 38 } }, goalsDiff: -21, points: 9,  form: 'LLLLL' },
    ],
  },
};

export const getLiveStandings = (req, res) => {
  const { leagueKey } = req.params;
  const data = STANDINGS[leagueKey];
  if (!data) return res.status(404).json({ message: 'Classifica non trovata' });
  res.json(data);
};

export const getLiveLeagues = (_req, res) => {
  res.json(LEAGUES);
};
