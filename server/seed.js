import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import League from './models/League.js';
import Season from './models/Season.js';
import Team from './models/Team.js';
import Player from './models/Player.js';
import Match from './models/Match.js';

dotenv.config();
await connectDB();

console.log('🌱 Seeding database...\n');

await Promise.all([
  User.deleteMany({}),
  League.deleteMany({}),
  Season.deleteMany({}),
  Team.deleteMany({}),
  Player.deleteMany({}),
  Match.deleteMany({}),
]);

await User.create({
  username: 'admin',
  email: 'admin@magyardream.hu',
  password: 'admin123',
  role: 'superadmin',
});
console.log('✅ Admin: admin@magyardream.hu / admin123');

const leaguesData = [
  { name: 'Nemzeti Bajnokság I', shortName: 'NB I',  slug: 'nb1',        tier: 1 },
  { name: 'Nemzeti Bajnokság II', shortName: 'NB II', slug: 'nb2',       tier: 2 },
  { name: 'Nemzeti Bajnokság III',shortName: 'NB III',slug: 'nb3',       tier: 3 },
  { name: 'Magyar Kupa',          shortName: 'MK',    slug: 'magyar-kupa',tier: 1 },
  { name: 'U19 Nemzeti Bajnokság',shortName: 'U19',   slug: 'u19',       tier: 4 },
  { name: 'U17 Nemzeti Bajnokság',shortName: 'U17',   slug: 'u17',       tier: 5 },
];
const leagues = await League.insertMany(leaguesData);
const nb1 = leagues[0];
console.log(`✅ ${leagues.length} leghe create`);

const season = await Season.create({
  name: '2024-25',
  league: nb1._id,
  startDate: new Date('2024-08-01'),
  endDate: new Date('2025-05-31'),
  active: true,
});
console.log('✅ Stagione 2024-25 creata');

const teamsData = [
  { name: 'Ferencvárosi TC',    shortName: 'FTC',  city: 'Budapest',         founded: 1899, stadium: 'Groupama Aréna',         capacity: 22000, primaryColor: '#007A4D', secondaryColor: '#FFFFFF' },
  { name: 'Paksi FC',           shortName: 'PAK',  city: 'Paks',             founded: 1952, stadium: 'Fehérvári úti Stadion',   capacity: 5500,  primaryColor: '#3D8B37', secondaryColor: '#FFD700' },
  { name: 'Fehérvár FC',        shortName: 'FEH',  city: 'Székesfehérvár',   founded: 1941, stadium: 'Sóstói Stadion',          capacity: 14800, primaryColor: '#003087', secondaryColor: '#E8B84B' },
  { name: 'Debreceni VSC',      shortName: 'DVSC', city: 'Debrecen',         founded: 1902, stadium: 'Nagyerdei Stadion',       capacity: 20340, primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { name: 'MTK Budapest FC',    shortName: 'MTK',  city: 'Budapest',         founded: 1888, stadium: 'Hidegkuti Nándor Stadion',capacity: 12700, primaryColor: '#003580', secondaryColor: '#FFFFFF' },
  { name: 'Puskás Akadémia FC', shortName: 'PAFC', city: 'Felcsút',          founded: 2005, stadium: 'Pancho Aréna',            capacity: 3816,  primaryColor: '#002B7F', secondaryColor: '#FFD700' },
  { name: 'Zalaegerszegi TE FC',shortName: 'ZTE',  city: 'Zalaegerszeg',     founded: 1920, stadium: 'ZTE Aréna',              capacity: 12500, primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { name: 'ETO FC Győr',        shortName: 'ETO',  city: 'Győr',             founded: 1904, stadium: 'ETO Park',               capacity: 12600, primaryColor: '#2B7A30', secondaryColor: '#FFFFFF' },
  { name: 'Kecskeméti TE',      shortName: 'KTE',  city: 'Kecskemét',        founded: 1911, stadium: 'Széktói Stadion',         capacity: 8000,  primaryColor: '#0033A0', secondaryColor: '#FFFFFF' },
  { name: 'Újpest FC',          shortName: 'UJP',  city: 'Budapest',         founded: 1885, stadium: 'Szusza Ferenc Stadion',   capacity: 13501, primaryColor: '#5B0D8F', secondaryColor: '#FFFFFF' },
  { name: 'Diósgyőri VTK',      shortName: 'DVTK', city: 'Miskolc',          founded: 1910, stadium: 'DVTK Stadion',           capacity: 10000, primaryColor: '#DC143C', secondaryColor: '#000000' },
  { name: 'Budapest Honvéd FC', shortName: 'BHF',  city: 'Budapest',         founded: 1909, stadium: 'Bozsik Aréna',           capacity: 8100,  primaryColor: '#DC143C', secondaryColor: '#FFFFFF' },
];
const teams = await Team.insertMany(teamsData.map(t => ({ ...t, leagues: [nb1._id], active: true })));
console.log(`✅ ${teams.length} squadre NB I create`);

const T = Object.fromEntries(teams.map(t => [t.shortName, t]));

const playersData = [
  { firstName: 'Dénes', lastName: 'Dibusz',      position: 'GK', number: 1,  nationality: 'HU', team: T.FTC._id },
  { firstName: 'Adnan', lastName: 'Kovačević',   position: 'DF', number: 4,  nationality: 'BA', team: T.FTC._id },
  { firstName: 'Samy', lastName: 'Mmaee',        position: 'DF', number: 5,  nationality: 'BE', team: T.FTC._id },
  { firstName: 'Kristoffer', lastName: 'Zachariassen', position: 'MF', number: 8, nationality: 'DK', team: T.FTC._id },
  { firstName: 'Aïssa', lastName: 'Laïdouni',    position: 'MF', number: 10, nationality: 'TN', team: T.FTC._id },
  { firstName: 'Marquinhos', lastName: 'Cipriano',position: 'FW', number: 9,  nationality: 'BR', team: T.FTC._id },
  { firstName: 'Tokmac', lastName: 'Nguen',       position: 'FW', number: 11, nationality: 'NO', team: T.FTC._id },
  { firstName: 'Ryan', lastName: 'Mmaee',         position: 'FW', number: 7,  nationality: 'BE', team: T.FTC._id },

  { firstName: 'Balázs', lastName: 'Végh',        position: 'GK', number: 1,  nationality: 'HU', team: T.PAK._id },
  { firstName: 'Bence', lastName: 'Könyves',      position: 'DF', number: 3,  nationality: 'HU', team: T.PAK._id },
  { firstName: 'Dávid', lastName: 'Kovács',       position: 'MF', number: 6,  nationality: 'HU', team: T.PAK._id },
  { firstName: 'Nikola', lastName: 'Šaponja',     position: 'MF', number: 8,  nationality: 'RS', team: T.PAK._id },
  { firstName: 'Ivan', lastName: 'Petrjak',       position: 'FW', number: 9,  nationality: 'UA', team: T.PAK._id },
  { firstName: 'Dávid', lastName: 'Windecker',    position: 'FW', number: 11, nationality: 'HU', team: T.PAK._id },

  { firstName: 'Ádám', lastName: 'Kovácsik',     position: 'GK', number: 1,  nationality: 'HU', team: T.FEH._id },
  { firstName: 'Paulo', lastName: 'Vinicius',    position: 'DF', number: 5,  nationality: 'BR', team: T.FEH._id },
  { firstName: 'Szabolcs', lastName: 'Schön',    position: 'MF', number: 10, nationality: 'HU', team: T.FEH._id },
  { firstName: 'Josip', lastName: 'Brekalo',     position: 'MF', number: 7,  nationality: 'HR', team: T.FEH._id },
  { firstName: 'Loïc', lastName: 'Nego',         position: 'DF', number: 2,  nationality: 'FR', team: T.FEH._id },
  { firstName: 'Bojan', lastName: 'Nikolov',     position: 'FW', number: 9,  nationality: 'MK', team: T.FEH._id },

  { firstName: 'Gergő', lastName: 'Bogdán',      position: 'GK', number: 1,  nationality: 'HU', team: T.DVSC._id },
  { firstName: 'Dzsudzsák', lastName: 'Balázs',  position: 'MF', number: 7,  nationality: 'HU', team: T.DVSC._id },
  { firstName: 'Artem', lastName: 'Favorov',     position: 'DF', number: 4,  nationality: 'UA', team: T.DVSC._id },
  { firstName: 'Lamine', lastName: 'Conte',      position: 'FW', number: 9,  nationality: 'GN', team: T.DVSC._id },
  { firstName: 'Gábor', lastName: 'Tamás',       position: 'DF', number: 5,  nationality: 'HU', team: T.DVSC._id },
  { firstName: 'Rodolph', lastName: 'Austin',    position: 'MF', number: 8,  nationality: 'JM', team: T.DVSC._id },

  { firstName: 'Branko', lastName: 'Panic',      position: 'GK', number: 1,  nationality: 'RS', team: T.MTK._id },
  { firstName: 'Bence', lastName: 'Merő',        position: 'DF', number: 3,  nationality: 'HU', team: T.MTK._id },
  { firstName: 'Ákos', lastName: 'Kecskés',      position: 'MF', number: 6,  nationality: 'HU', team: T.MTK._id },
  { firstName: 'László', lastName: 'Lencse',     position: 'FW', number: 9,  nationality: 'HU', team: T.MTK._id },
  { firstName: 'Zsombor', lastName: 'Berecz',    position: 'MF', number: 8,  nationality: 'HU', team: T.MTK._id },

  { firstName: 'Péter', lastName: 'Szappanos',   position: 'GK', number: 1,  nationality: 'HU', team: T.PAFC._id },
  { firstName: 'Roland', lastName: 'Varga',      position: 'DF', number: 4,  nationality: 'HU', team: T.PAFC._id },
  { firstName: 'Dávid', lastName: 'Cseh',        position: 'MF', number: 8,  nationality: 'HU', team: T.PAFC._id },
  { firstName: 'Mirko', lastName: 'Ivanić',      position: 'MF', number: 10, nationality: 'RS', team: T.PAFC._id },
  { firstName: 'Ádám', lastName: 'Gyurcsó',      position: 'FW', number: 9,  nationality: 'HU', team: T.PAFC._id },

  { firstName: 'Ádám', lastName: 'Rácz',         position: 'GK', number: 1,  nationality: 'HU', team: T.ZTE._id },
  { firstName: 'Dario', lastName: 'Benedičič',   position: 'DF', number: 4,  nationality: 'SI', team: T.ZTE._id },
  { firstName: 'Stjepan', lastName: 'Vulić',     position: 'MF', number: 6,  nationality: 'HR', team: T.ZTE._id },
  { firstName: 'Dénes', lastName: 'Csernik',     position: 'FW', number: 9,  nationality: 'HU', team: T.ZTE._id },

  { firstName: 'Ádám', lastName: 'Waltner',      position: 'GK', number: 1,  nationality: 'HU', team: T.ETO._id },
  { firstName: 'Tamás', lastName: 'Kecskés',     position: 'DF', number: 5,  nationality: 'HU', team: T.ETO._id },
  { firstName: 'Richárd', lastName: 'Guzmics',   position: 'DF', number: 6,  nationality: 'HU', team: T.ETO._id },
  { firstName: 'Lovro', lastName: 'Cvek',        position: 'MF', number: 8,  nationality: 'HR', team: T.ETO._id },
  { firstName: 'Krisztofer', lastName: 'Horváth',position: 'FW', number: 9,  nationality: 'HU', team: T.ETO._id },

  { firstName: 'Bence', lastName: 'Horváth',    position: 'GK', number: 1,  nationality: 'HU', team: T.KTE._id },
  { firstName: 'Zsolt', lastName: 'Cságola',    position: 'DF', number: 3,  nationality: 'HU', team: T.KTE._id },
  { firstName: 'Miloš', lastName: 'Adamović',   position: 'MF', number: 8,  nationality: 'RS', team: T.KTE._id },
  { firstName: 'Balázs', lastName: 'Tóth',      position: 'FW', number: 9,  nationality: 'HU', team: T.KTE._id },

  { firstName: 'Lajos', lastName: 'Hegedűs',    position: 'GK', number: 1,  nationality: 'HU', team: T.UJP._id },
  { firstName: 'David', lastName: 'Babunski',   position: 'MF', number: 10, nationality: 'MK', team: T.UJP._id },
  { firstName: 'Tibor', lastName: 'Heffler',    position: 'MF', number: 6,  nationality: 'HU', team: T.UJP._id },
  { firstName: 'Donát', lastName: 'Fülöp',      position: 'FW', number: 9,  nationality: 'HU', team: T.UJP._id },

  { firstName: 'Kristián', lastName: 'Tóth',    position: 'GK', number: 1,  nationality: 'HU', team: T.DVTK._id },
  { firstName: 'Bojan', lastName: 'Sabolović',  position: 'DF', number: 4,  nationality: 'RS', team: T.DVTK._id },
  { firstName: 'Vajda', lastName: 'Bouadla',    position: 'MF', number: 7,  nationality: 'DZ', team: T.DVTK._id },
  { firstName: 'Kristóf', lastName: 'Dankó',    position: 'FW', number: 9,  nationality: 'HU', team: T.DVTK._id },

  { firstName: 'Dominik', lastName: 'Greif',    position: 'GK', number: 1,  nationality: 'SK', team: T.BHF._id },
  { firstName: 'Ádám', lastName: 'Pálvölgyi',   position: 'DF', number: 3,  nationality: 'HU', team: T.BHF._id },
  { firstName: 'Máté', lastName: 'Pátkai',      position: 'MF', number: 8,  nationality: 'HU', team: T.BHF._id },
  { firstName: 'Roland', lastName: 'Ugrai',     position: 'FW', number: 9,  nationality: 'HU', team: T.BHF._id },
];

const players = await Player.insertMany(playersData.map(p => ({ ...p, active: true })));
console.log(`✅ ${players.length} giocatori creati`);

const P = {};
for (const p of players) {
  const teamShort = Object.entries(T).find(([, t]) => t._id.equals(p.team))?.[0];
  if (teamShort) P[`${teamShort}_${p.lastName}`] = p._id;
}

function generateFixtures(n) {
  const teams = Array.from({ length: n }, (_, i) => i);
  const rounds = [];
  for (let round = 0; round < n - 1; round++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([teams[i], teams[n - 1 - i]]);
    }
    rounds.push(pairs);
    teams.splice(1, 0, teams.pop());
  }
  return rounds;
}

const fixtures = generateFixtures(12);

const strength = {
  FTC: 90, PAK: 78, FEH: 75, DVSC: 72, MTK: 68,
  PAFC: 65, ZTE: 60, ETO: 58, KTE: 55, UJP: 52,
  DVTK: 48, BHF: 42,
};
const teamShortNames = ['FTC', 'PAK', 'FEH', 'DVSC', 'MTK', 'PAFC', 'ZTE', 'ETO', 'KTE', 'UJP', 'DVTK', 'BHF'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateScore(homeStr, awayStr) {
  const diff = (homeStr - awayStr + 10) / 100;
  const homeExpected = Math.max(0.3, 1.2 + diff * 1.5);
  const awayExpected = Math.max(0.3, 1.0 - diff * 1.5);
  const h = Math.min(6, Math.round(homeExpected * (0.5 + Math.random())));
  const a = Math.min(5, Math.round(awayExpected * (0.5 + Math.random())));
  return [h, a];
}

function pickGoalPlayers(teamShort, count) {
  const fwPlayers = players.filter(p => p.team.equals(T[teamShort]._id) && ['FW', 'MF'].includes(p.position));
  const events = [];
  for (let i = 0; i < count; i++) {
    if (fwPlayers.length === 0) break;
    const scorer = fwPlayers[rand(0, fwPlayers.length - 1)];
    const minute = rand(3, 90);
    events.push({ type: 'goal', minute, team: T[teamShort]._id, player: scorer._id });
  }
  return events;
}

function maybeCard(teamShort) {
  const allPlayers = players.filter(p => p.team.equals(T[teamShort]._id) && p.position !== 'GK');
  if (allPlayers.length === 0 || Math.random() > 0.6) return null;
  const p = allPlayers[rand(0, allPlayers.length - 1)];
  const type = Math.random() < 0.85 ? 'yellow_card' : 'red_card';
  return { type, minute: rand(20, 88), team: T[teamShort]._id, player: p._id };
}

const matchDocs = [];
const startDate = new Date('2024-08-03');

for (let md = 0; md < 20; md++) {
  const matchdayDate = new Date(startDate);
  matchdayDate.setDate(startDate.getDate() + md * 7);
  const roundPairs = fixtures[md % fixtures.length];

  for (const [hi, ai] of roundPairs) {
    const homeShort = teamShortNames[hi];
    const awayShort = teamShortNames[ai];
    if (!T[homeShort] || !T[awayShort]) continue;

    const [homeScore, awayScore] = generateScore(strength[homeShort], strength[awayShort]);
    const matchDate = new Date(matchdayDate);
    matchDate.setHours(rand(15, 20), rand(0, 1) * 30, 0, 0);

    const events = [
      ...pickGoalPlayers(homeShort, homeScore),
      ...pickGoalPlayers(awayShort, awayScore),
    ];

    const homeCard = maybeCard(homeShort);
    const awayCard = maybeCard(awayShort);
    if (homeCard) events.push(homeCard);
    if (awayCard) events.push(awayCard);

    events.sort((a, b) => a.minute - b.minute);

    matchDocs.push({
      homeTeam: T[homeShort]._id,
      awayTeam: T[awayShort]._id,
      league: nb1._id,
      season: season._id,
      matchday: md + 1,
      date: matchDate,
      venue: T[homeShort].stadium || '',
      status: 'finished',
      homeScore,
      awayScore,
      events,
    });
  }
}

const nextMatchDate = new Date(startDate);
nextMatchDate.setDate(startDate.getDate() + 20 * 7);
matchDocs.push(
  { homeTeam: T.FTC._id, awayTeam: T.PAK._id, league: nb1._id, season: season._id, matchday: 21, date: new Date(nextMatchDate.getTime() + 15 * 3600000), venue: T.FTC.stadium, status: 'scheduled', homeScore: null, awayScore: null, events: [] },
  { homeTeam: T.DVSC._id, awayTeam: T.MTK._id, league: nb1._id, season: season._id, matchday: 21, date: new Date(nextMatchDate.getTime() + 18 * 3600000), venue: T.DVSC.stadium, status: 'scheduled', homeScore: null, awayScore: null, events: [] },
  { homeTeam: T.FEH._id, awayTeam: T.UJP._id, league: nb1._id, season: season._id, matchday: 21, date: new Date(nextMatchDate.getTime() + 20 * 3600000), venue: T.FEH.stadium, status: 'scheduled', homeScore: null, awayScore: null, events: [] },
);

await Match.insertMany(matchDocs);
console.log(`✅ ${matchDocs.length} partite create (20 giornate + 3 programmate)`);

console.log('\n🎉 Seed completato con successo!');
console.log('   Login admin: admin@magyardream.hu / admin123');
mongoose.disconnect();
