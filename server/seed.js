import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import League from './models/League.js';
import Season from './models/Season.js';
import Team from './models/Team.js';
import Player from './models/Player.js';
import Match from './models/Match.js';
import Standings from './models/Standings.js';

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
  Standings.deleteMany({}),
]);

await User.create({
  username: 'admin',
  email: 'admin@magyardream.hu',
  password: 'admin123',
  role: 'superadmin',
});
console.log('✅ Admin: admin@magyardream.hu / admin123');

const leaguesData = [
  { name: 'Nemzeti Bajnokság I',   shortName: 'NB I',  slug: 'nb1',         tier: 1 },
  { name: 'Nemzeti Bajnokság II',  shortName: 'NB II', slug: 'nb2',         tier: 2 },
  { name: 'Magyar Kupa',           shortName: 'MK',    slug: 'magyar-kupa', tier: 1 },
  { name: 'U19 Nemzeti Bajnokság', shortName: 'U19',   slug: 'u19',         tier: 4 },
];
const leagues = await League.insertMany(leaguesData);
const nb1 = leagues[0];
const nb2 = leagues[1];
console.log(`✅ ${leagues.length} leghe create`);

const season = await Season.create({
  name: '2024-25',
  league: nb1._id,
  startDate: new Date('2025-07-25'),
  endDate: new Date('2026-05-31'),
  active: true,
});
console.log('✅ Stagione 2024-25 creata');

const teamsData = [
  { shortName: 'GYR',  name: 'ETO FC Győr',            city: 'Győr',            founded: 1904, stadium: 'ETO Park',                  capacity: 12600, primaryColor: '#2B7A30', secondaryColor: '#FFFFFF' },
  { shortName: 'FTC',  name: 'Ferencvárosi TC',         city: 'Budapest',        founded: 1899, stadium: 'Groupama Aréna',             capacity: 22000, primaryColor: '#007A4D', secondaryColor: '#FFFFFF' },
  { shortName: 'DVSC', name: 'Debreceni VSC',           city: 'Debrecen',        founded: 1902, stadium: 'Nagyerdei Stadion',          capacity: 20340, primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { shortName: 'ZTE',  name: 'Zalaegerszegi TE FC',     city: 'Zalaegerszeg',    founded: 1920, stadium: 'ZTE Aréna',                 capacity: 12500, primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'PAK',  name: 'Paksi FC',                city: 'Paks',            founded: 1952, stadium: 'Fehérvári úti Stadion',      capacity: 5500,  primaryColor: '#3D8B37', secondaryColor: '#FFD700' },
  { shortName: 'PAFC', name: 'Puskás Akadémia FC',      city: 'Felcsút',         founded: 2005, stadium: 'Pancho Aréna',               capacity: 3816,  primaryColor: '#002B7F', secondaryColor: '#FFD700' },
  { shortName: 'UJP',  name: 'Újpest FC',               city: 'Budapest',        founded: 1885, stadium: 'Szusza Ferenc Stadion',      capacity: 13501, primaryColor: '#5B0D8F', secondaryColor: '#FFFFFF' },
  { shortName: 'KSV',  name: 'Kisvárda FC',             city: 'Kisvárda',        founded: 1911, stadium: 'Várkerti Stadion',           capacity: 5000,  primaryColor: '#003087', secondaryColor: '#FFFFFF' },
  { shortName: 'NYI',  name: 'Nyíregyháza Spartacus FC',city: 'Nyíregyháza',     founded: 1909, stadium: 'Városi Stadion',             capacity: 13500, primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { shortName: 'MTK',  name: 'MTK Budapest FC',         city: 'Budapest',        founded: 1888, stadium: 'Hidegkuti Nándor Stadion',   capacity: 12700, primaryColor: '#003580', secondaryColor: '#FFFFFF' },
  { shortName: 'DVTK', name: 'Diósgyőri VTK',          city: 'Miskolc',         founded: 1910, stadium: 'DVTK Stadion',              capacity: 10000, primaryColor: '#DC143C', secondaryColor: '#000000' },
  { shortName: 'KAZ',  name: 'FC Kazincbarcika',        city: 'Kazincbarcika',   founded: 1946, stadium: 'KBSC Stadion',              capacity: 5000,  primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
];
const teams = await Team.insertMany(teamsData.map(t => ({ ...t, leagues: [nb1._id], active: true })));
console.log(`✅ ${teams.length} squadre NB I create`);

const T = Object.fromEntries(teams.map(t => [t.shortName, t]));

const playersData = [
  { firstName: 'Ádám',       lastName: 'Kovácsik',   position: 'GK', number: 1,  nationality: 'HU', team: T.GYR._id },
  { firstName: 'Péter',      lastName: 'Szappanos',  position: 'GK', number: 1,  nationality: 'HU', team: T.FTC._id },
  { firstName: 'Gergő',      lastName: 'Bogdán',     position: 'GK', number: 1,  nationality: 'HU', team: T.DVSC._id },
  { firstName: 'Ádám',       lastName: 'Rácz',       position: 'GK', number: 1,  nationality: 'HU', team: T.ZTE._id },
  { firstName: 'Balázs',     lastName: 'Végh',       position: 'GK', number: 1,  nationality: 'HU', team: T.PAK._id },
  { firstName: 'Zsombor',    lastName: 'Király',     position: 'GK', number: 1,  nationality: 'HU', team: T.PAFC._id },
  { firstName: 'Lajos',      lastName: 'Hegedűs',    position: 'GK', number: 1,  nationality: 'HU', team: T.UJP._id },
  { firstName: 'Bence',      lastName: 'Horváth',    position: 'GK', number: 1,  nationality: 'HU', team: T.KSV._id },
  { firstName: 'Nikola',     lastName: 'Muric',      position: 'GK', number: 1,  nationality: 'RS', team: T.NYI._id },
  { firstName: 'Branko',     lastName: 'Panic',      position: 'GK', number: 1,  nationality: 'RS', team: T.MTK._id },
  { firstName: 'Kristián',   lastName: 'Tóth',       position: 'GK', number: 1,  nationality: 'HU', team: T.DVTK._id },
  { firstName: 'Bence',      lastName: 'Szabó',      position: 'GK', number: 1,  nationality: 'HU', team: T.KAZ._id },

  { firstName: 'Krisztofer', lastName: 'Horváth',    position: 'FW', number: 9,  nationality: 'HU', team: T.GYR._id },
  { firstName: 'Barnabás',   lastName: 'Varga',      position: 'FW', number: 9,  nationality: 'HU', team: T.GYR._id },
  { firstName: 'Marquinhos', lastName: 'Cipriano',   position: 'FW', number: 9,  nationality: 'BR', team: T.FTC._id },
  { firstName: 'Tokmac',     lastName: 'Nguen',      position: 'FW', number: 11, nationality: 'NO', team: T.FTC._id },
  { firstName: 'Lamine',     lastName: 'Conte',      position: 'FW', number: 9,  nationality: 'GN', team: T.DVSC._id },
  { firstName: 'Dzsudzsák',  lastName: 'Balázs',     position: 'MF', number: 7,  nationality: 'HU', team: T.DVSC._id },
  { firstName: 'Dénes',      lastName: 'Csernik',    position: 'FW', number: 9,  nationality: 'HU', team: T.ZTE._id },
  { firstName: 'Stjepan',    lastName: 'Vulić',      position: 'MF', number: 6,  nationality: 'HR', team: T.ZTE._id },
  { firstName: 'Ivan',       lastName: 'Petrjak',    position: 'FW', number: 9,  nationality: 'UA', team: T.PAK._id },
  { firstName: 'Dávid',      lastName: 'Windecker',  position: 'FW', number: 11, nationality: 'HU', team: T.PAK._id },
  { firstName: 'Ádám',       lastName: 'Gyurcsó',    position: 'FW', number: 9,  nationality: 'HU', team: T.PAFC._id },
  { firstName: 'Mirko',      lastName: 'Ivanić',     position: 'MF', number: 10, nationality: 'RS', team: T.PAFC._id },
  { firstName: 'David',      lastName: 'Babunski',   position: 'MF', number: 10, nationality: 'MK', team: T.UJP._id },
  { firstName: 'Donát',      lastName: 'Fülöp',      position: 'FW', number: 9,  nationality: 'HU', team: T.UJP._id },
  { firstName: 'Balázs',     lastName: 'Tóth',       position: 'FW', number: 9,  nationality: 'HU', team: T.KSV._id },
  { firstName: 'Miloš',      lastName: 'Adamović',   position: 'MF', number: 8,  nationality: 'RS', team: T.KSV._id },
  { firstName: 'Kristóf',    lastName: 'Bárány',     position: 'FW', number: 9,  nationality: 'HU', team: T.NYI._id },
  { firstName: 'László',     lastName: 'Lencse',     position: 'FW', number: 9,  nationality: 'HU', team: T.MTK._id },
  { firstName: 'Ákos',       lastName: 'Kecskés',    position: 'MF', number: 6,  nationality: 'HU', team: T.MTK._id },
  { firstName: 'Kristóf',    lastName: 'Dankó',      position: 'FW', number: 9,  nationality: 'HU', team: T.DVTK._id },
  { firstName: 'Vajda',      lastName: 'Bouadla',    position: 'MF', number: 7,  nationality: 'DZ', team: T.DVTK._id },
  { firstName: 'Zsolt',      lastName: 'Nagy',       position: 'FW', number: 9,  nationality: 'HU', team: T.KAZ._id },
  { firstName: 'Dávid',      lastName: 'Kovács',     position: 'MF', number: 6,  nationality: 'HU', team: T.KAZ._id },
];
const players = await Player.insertMany(playersData.map(p => ({ ...p, active: true })));
console.log(`✅ ${players.length} giocatori creati`);

const MATCHES_RAW = [
  [1, '2025-07-27T15:00:00', 'PAFC', 2, 1, 'KAZ'],
  [1, '2025-07-27T17:00:00', 'PAK',  3, 3, 'GYR'],
  [1, '2025-07-27T17:00:00', 'NYI',  1, 1, 'KSV'],
  [1, '2025-07-26T17:00:00', 'MTK',  1, 1, 'FTC'],
  [1, '2025-07-26T17:00:00', 'ZTE',  3, 3, 'DVSC'],
  [1, '2025-07-25T17:00:00', 'UJP',  3, 1, 'DVTK'],

  [2, '2025-08-03T17:00:00', 'GYR',  1, 1, 'UJP'],
  [2, '2025-08-03T17:00:00', 'KSV',  1, 5, 'PAK'],
  [2, '2025-08-03T17:00:00', 'PAFC', 3, 2, 'NYI'],
  [2, '2025-08-02T17:00:00', 'FTC',  3, 0, 'KAZ'],
  [2, '2025-08-02T17:00:00', 'DVTK', 2, 2, 'ZTE'],
  [2, '2025-08-01T17:00:00', 'DVSC', 1, 0, 'MTK'],

  [3, '2025-08-10T17:00:00', 'UJP',  1, 2, 'PAK'],
  [3, '2025-08-10T17:00:00', 'KSV',  2, 1, 'PAFC'],
  [3, '2025-08-10T17:00:00', 'ZTE',  1, 1, 'GYR'],
  [3, '2025-08-09T17:00:00', 'NYI',  1, 4, 'FTC'],
  [3, '2025-08-09T17:00:00', 'MTK',  5, 0, 'DVTK'],
  [3, '2025-08-08T17:00:00', 'KAZ',  1, 2, 'DVSC'],

  [4, '2025-08-17T17:00:00', 'PAK',  2, 2, 'ZTE'],
  [4, '2025-08-17T17:00:00', 'MTK',  2, 7, 'GYR'],
  [4, '2025-08-17T17:00:00', 'DVSC', 1, 2, 'NYI'],
  [4, '2025-08-16T17:00:00', 'FTC',  1, 2, 'PAFC'],
  [4, '2025-08-16T17:00:00', 'DVTK', 2, 2, 'KAZ'],
  [4, '2025-08-15T17:00:00', 'UJP',  0, 1, 'KSV'],

  [5, '2025-08-24T17:00:00', 'MTK',  2, 3, 'PAK'],
  [5, '2025-08-23T17:00:00', 'NYI',  1, 4, 'DVTK'],
  [5, '2025-08-23T17:00:00', 'ZTE',  1, 4, 'UJP'],
  [5, '2025-08-22T17:00:00', 'PAFC', 1, 3, 'DVSC'],
  [5, '2025-12-04T17:00:00', 'KSV',  0, 1, 'FTC'],
  [5, '2025-12-03T17:00:00', 'KAZ',  1, 3, 'GYR'],

  [6, '2025-08-31T17:00:00', 'DVSC', 0, 3, 'FTC'],
  [6, '2025-08-31T17:00:00', 'GYR',  1, 0, 'NYI'],
  [6, '2025-08-30T17:00:00', 'UJP',  1, 2, 'MTK'],
  [6, '2025-08-30T17:00:00', 'DVTK', 1, 1, 'PAFC'],
  [6, '2025-08-30T17:00:00', 'ZTE',  1, 2, 'KSV'],
  [6, '2025-08-29T17:00:00', 'PAK',  3, 0, 'KAZ'],

  [7, '2025-09-21T17:00:00', 'MTK',  1, 0, 'ZTE'],
  [7, '2025-09-21T17:00:00', 'KSV',  0, 1, 'DVSC'],
  [7, '2025-09-20T17:00:00', 'PAFC', 0, 2, 'GYR'],
  [7, '2025-09-20T17:00:00', 'KAZ',  2, 0, 'UJP'],
  [7, '2025-09-20T17:00:00', 'NYI',  1, 1, 'PAK'],
  [7, '2025-09-19T17:00:00', 'FTC',  2, 2, 'DVTK'],

  [8, '2025-09-28T17:00:00', 'GYR',  0, 2, 'FTC'],
  [8, '2025-09-28T17:00:00', 'MTK',  4, 0, 'KSV'],
  [8, '2025-09-27T17:00:00', 'PAK',  3, 2, 'PAFC'],
  [8, '2025-09-27T17:00:00', 'DVTK', 0, 0, 'DVSC'],
  [8, '2025-09-27T17:00:00', 'ZTE',  5, 0, 'KAZ'],
  [8, '2025-09-26T17:00:00', 'UJP',  2, 2, 'NYI'],

  [9, '2025-10-05T17:00:00', 'KSV',  1, 0, 'DVTK'],
  [9, '2025-10-05T17:00:00', 'FTC',  2, 2, 'PAK'],
  [9, '2025-10-04T17:00:00', 'DVSC', 1, 1, 'GYR'],
  [9, '2025-10-04T17:00:00', 'PAFC', 0, 0, 'UJP'],
  [9, '2025-10-04T17:00:00', 'NYI',  3, 1, 'ZTE'],
  [9, '2025-10-03T17:00:00', 'KAZ',  3, 1, 'MTK'],

  [10, '2025-10-19T17:00:00', 'UJP',  1, 1, 'FTC'],
  [10, '2025-10-19T17:00:00', 'ZTE',  0, 1, 'PAFC'],
  [10, '2025-10-19T17:00:00', 'KAZ',  0, 1, 'KSV'],
  [10, '2025-10-18T17:00:00', 'GYR',  3, 1, 'DVTK'],
  [10, '2025-10-18T17:00:00', 'PAK',  1, 1, 'DVSC'],
  [10, '2025-10-18T17:00:00', 'MTK',  5, 1, 'NYI'],

  [11, '2025-10-26T17:00:00', 'FTC',  1, 2, 'ZTE'],
  [11, '2025-10-26T17:00:00', 'DVSC', 5, 2, 'UJP'],
  [11, '2025-10-26T17:00:00', 'KSV',  3, 2, 'GYR'],
  [11, '2025-10-25T17:00:00', 'NYI',  0, 1, 'KAZ'],
  [11, '2025-10-25T17:00:00', 'DVTK', 2, 1, 'PAK'],
  [11, '2025-10-25T17:00:00', 'PAFC', 1, 1, 'MTK'],

  [12, '2025-11-02T17:00:00', 'DVSC', 2, 1, 'ZTE'],
  [12, '2025-11-02T17:00:00', 'DVTK', 1, 3, 'UJP'],
  [12, '2025-11-01T17:00:00', 'FTC',  4, 1, 'MTK'],
  [12, '2025-11-01T17:00:00', 'GYR',  0, 0, 'PAK'],
  [12, '2025-11-01T17:00:00', 'KAZ',  1, 3, 'PAFC'],
  [12, '2025-10-31T17:00:00', 'KSV',  0, 0, 'NYI'],

  [13, '2025-11-09T17:00:00', 'NYI',  1, 1, 'PAFC'],
  [13, '2025-11-09T17:00:00', 'KAZ',  1, 3, 'FTC'],
  [13, '2025-11-09T17:00:00', 'MTK',  3, 0, 'DVSC'],
  [13, '2025-11-08T17:00:00', 'PAK',  5, 3, 'KSV'],
  [13, '2025-11-08T17:00:00', 'ZTE',  2, 0, 'DVTK'],
  [13, '2025-11-08T17:00:00', 'UJP',  0, 3, 'GYR'],

  [14, '2025-11-23T17:00:00', 'DVTK', 4, 0, 'MTK'],
  [14, '2025-11-23T17:00:00', 'PAK',  1, 3, 'UJP'],
  [14, '2025-11-22T17:00:00', 'FTC',  1, 3, 'NYI'],
  [14, '2025-11-22T17:00:00', 'DVSC', 2, 1, 'KAZ'],
  [14, '2025-11-22T17:00:00', 'PAFC', 2, 0, 'KSV'],
  [14, '2025-11-21T17:00:00', 'GYR',  0, 1, 'ZTE'],

  [15, '2025-11-30T17:00:00', 'PAFC', 1, 2, 'FTC'],
  [15, '2025-11-30T17:00:00', 'KSV',  3, 0, 'UJP'],
  [15, '2025-11-29T17:00:00', 'GYR',  3, 0, 'MTK'],
  [15, '2025-11-29T17:00:00', 'KAZ',  1, 1, 'DVTK'],
  [15, '2025-11-29T17:00:00', 'ZTE',  1, 0, 'PAK'],
  [15, '2025-11-28T17:00:00', 'NYI',  0, 3, 'DVSC'],

  [16, '2025-12-07T17:00:00', 'UJP',  0, 2, 'ZTE'],
  [16, '2025-12-07T17:00:00', 'FTC',  3, 0, 'KSV'],
  [16, '2025-12-07T17:00:00', 'GYR',  3, 1, 'KAZ'],
  [16, '2025-12-06T17:00:00', 'PAK',  3, 1, 'MTK'],
  [16, '2025-12-06T17:00:00', 'DVSC', 0, 1, 'PAFC'],
  [16, '2025-12-06T17:00:00', 'DVTK', 2, 0, 'NYI'],

  [17, '2025-12-14T17:00:00', 'KSV',  2, 3, 'ZTE'],
  [17, '2025-12-14T17:00:00', 'FTC',  0, 1, 'DVSC'],
  [17, '2025-12-14T17:00:00', 'KAZ',  0, 2, 'PAK'],
  [17, '2025-12-13T17:00:00', 'MTK',  3, 4, 'UJP'],
  [17, '2025-12-13T17:00:00', 'PAFC', 2, 1, 'DVTK'],
  [17, '2025-12-13T17:00:00', 'NYI',  0, 1, 'GYR'],

  [18, '2025-12-21T17:00:00', 'DVSC', 0, 1, 'KSV'],
  [18, '2025-12-21T17:00:00', 'UJP',  2, 1, 'KAZ'],
  [18, '2025-12-20T17:00:00', 'GYR',  2, 0, 'PAFC'],
  [18, '2025-12-20T17:00:00', 'PAK',  2, 1, 'NYI'],
  [18, '2025-12-20T17:00:00', 'ZTE',  1, 1, 'MTK'],
  [18, '2025-12-19T17:00:00', 'DVTK', 0, 1, 'FTC'],

  [19, '2026-01-25T17:00:00', 'FTC',  1, 3, 'GYR'],
  [19, '2026-01-25T17:00:00', 'KAZ',  0, 1, 'ZTE'],
  [19, '2026-01-25T17:00:00', 'DVSC', 3, 2, 'DVTK'],
  [19, '2026-01-24T17:00:00', 'PAFC', 1, 2, 'PAK'],
  [19, '2026-01-24T17:00:00', 'KSV',  2, 3, 'MTK'],
  [19, '2026-01-24T17:00:00', 'NYI',  1, 1, 'UJP'],

  [20, '2026-02-01T17:00:00', 'ZTE',  0, 1, 'NYI'],
  [20, '2026-02-01T17:00:00', 'PAK',  0, 1, 'FTC'],
  [20, '2026-02-01T17:00:00', 'DVTK', 1, 1, 'KSV'],
  [20, '2026-01-31T17:00:00', 'UJP',  0, 1, 'PAFC'],
  [20, '2026-01-31T17:00:00', 'GYR',  2, 2, 'DVSC'],
  [20, '2026-01-31T17:00:00', 'MTK',  1, 3, 'KAZ'],

  [21, '2026-02-08T17:00:00', 'NYI',  4, 2, 'MTK'],
  [21, '2026-02-08T17:00:00', 'PAFC', 0, 1, 'ZTE'],
  [21, '2026-02-07T17:00:00', 'FTC',  3, 0, 'UJP'],
  [21, '2026-02-07T17:00:00', 'DVSC', 1, 0, 'PAK'],
  [21, '2026-02-07T17:00:00', 'DVTK', 1, 1, 'GYR'],
  [21, '2026-02-06T17:00:00', 'KSV',  1, 0, 'KAZ'],

  [22, '2026-02-15T17:00:00', 'GYR',  1, 0, 'KSV'],
  [22, '2026-02-15T17:00:00', 'KAZ',  0, 4, 'NYI'],
  [22, '2026-02-14T17:00:00', 'PAK',  1, 2, 'DVTK'],
  [22, '2026-02-14T17:00:00', 'ZTE',  3, 1, 'FTC'],
  [22, '2026-02-14T17:00:00', 'MTK',  2, 2, 'PAFC'],
  [22, '2026-02-13T17:00:00', 'UJP',  2, 1, 'DVSC'],

  [23, '2026-02-23T17:00:00', 'MTK',  1, 3, 'FTC'],
  [23, '2026-02-22T17:00:00', 'PAK',  3, 4, 'GYR'],
  [23, '2026-02-22T17:00:00', 'ZTE',  1, 1, 'DVSC'],
  [23, '2026-02-21T17:00:00', 'UJP',  2, 1, 'DVTK'],
  [23, '2026-02-21T17:00:00', 'KAZ',  0, 2, 'PAFC'],
  [23, '2026-02-21T17:00:00', 'NYI',  2, 2, 'KSV'],

  [24, '2026-03-01T17:00:00', 'FTC',  2, 1, 'KAZ'],
  [24, '2026-03-01T17:00:00', 'PAFC', 1, 2, 'NYI'],
  [24, '2026-02-28T17:00:00', 'GYR',  2, 1, 'UJP'],
  [24, '2026-02-28T17:00:00', 'DVTK', 1, 1, 'ZTE'],
  [24, '2026-02-28T17:00:00', 'KSV',  2, 1, 'PAK'],
  [24, '2026-02-27T17:00:00', 'DVSC', 2, 2, 'MTK'],

  [25, '2026-03-08T17:00:00', 'NYI',  1, 3, 'FTC'],
  [25, '2026-03-08T17:00:00', 'KAZ',  0, 3, 'DVSC'],
  [25, '2026-03-08T17:00:00', 'MTK',  1, 1, 'DVTK'],
  [25, '2026-03-07T17:00:00', 'UJP',  0, 0, 'PAK'],
  [25, '2026-03-07T17:00:00', 'ZTE',  2, 1, 'GYR'],
  [25, '2026-03-06T17:00:00', 'KSV',  1, 0, 'PAFC'],

  [26, '2026-04-14T17:00:00', 'FTC',  2, 1, 'PAFC'],
  [26, '2026-03-14T17:00:00', 'DVSC', 1, 1, 'NYI'],
  [26, '2026-03-14T17:00:00', 'PAK',  1, 1, 'ZTE'],
  [26, '2026-03-14T17:00:00', 'UJP',  2, 1, 'KSV'],
  [26, '2026-03-13T17:00:00', 'GYR',  0, 0, 'MTK'],
  [26, '2026-03-13T17:00:00', 'DVTK', 0, 4, 'KAZ'],

  [27, '2026-03-22T17:00:00', 'KSV',  1, 1, 'FTC'],
  [27, '2026-03-22T17:00:00', 'KAZ',  1, 3, 'GYR'],
  [27, '2026-03-22T17:00:00', 'PAFC', 1, 1, 'DVSC'],
  [27, '2026-03-21T17:00:00', 'ZTE',  2, 0, 'UJP'],
  [27, '2026-03-21T17:00:00', 'NYI',  3, 1, 'DVTK'],
  [27, '2026-03-20T17:00:00', 'MTK',  0, 2, 'PAK'],

  [28, '2026-04-05T17:00:00', 'GYR',  1, 0, 'NYI'],
  [28, '2026-04-05T17:00:00', 'DVSC', 0, 2, 'FTC'],
  [28, '2026-04-05T17:00:00', 'DVTK', 1, 2, 'PAFC'],
  [28, '2026-04-04T17:00:00', 'UJP',  2, 2, 'MTK'],
  [28, '2026-04-04T17:00:00', 'PAK',  5, 1, 'KAZ'],
  [28, '2026-04-04T17:00:00', 'ZTE',  2, 0, 'KSV'],

  [29, '2026-04-13T17:00:00', 'KSV',  0, 0, 'DVSC'],
  [29, '2026-04-11T17:00:00', 'NYI',  2, 0, 'PAK'],
  [29, '2026-04-11T17:00:00', 'MTK',  3, 0, 'ZTE'],
  [29, '2026-04-11T17:00:00', 'KAZ',  0, 3, 'UJP'],
  [29, '2026-04-10T17:00:00', 'FTC',  3, 1, 'DVTK'],
  [29, '2026-04-10T17:00:00', 'PAFC', 1, 4, 'GYR'],

  [30, '2026-04-19T17:00:00', 'GYR',  1, 0, 'FTC'],
  [30, '2026-04-19T17:00:00', 'PAK',  1, 0, 'PAFC'],
  [30, '2026-04-18T17:00:00', 'DVTK', 0, 5, 'DVSC'],
  [30, '2026-04-18T17:00:00', 'MTK',  2, 1, 'KSV'],
  [30, '2026-04-18T17:00:00', 'ZTE',  4, 0, 'KAZ'],
  [30, '2026-04-17T17:00:00', 'UJP',  7, 2, 'NYI'],

  [31, '2026-04-26T17:00:00', 'DVSC', 1, 1, 'GYR'],
  [31, '2026-04-26T17:00:00', 'FTC',  2, 0, 'PAK'],
  [31, '2026-04-25T17:00:00', 'NYI',  2, 1, 'ZTE'],
  [31, '2026-04-25T17:00:00', 'PAFC', 2, 0, 'UJP'],
  [31, '2026-04-25T17:00:00', 'KSV',  1, 2, 'DVTK'],
  [31, '2026-04-24T17:00:00', 'KAZ',  0, 0, 'MTK'],
];

const matchDocs = MATCHES_RAW.map(([matchday, dateStr, homeShort, homeScore, awayScore, awayShort]) => ({
  homeTeam: T[homeShort]._id,
  awayTeam: T[awayShort]._id,
  league: nb1._id,
  season: season._id,
  matchday,
  date: new Date(dateStr),
  venue: T[homeShort].stadium || '',
  status: 'finished',
  homeScore,
  awayScore,
  events: [],
}));

await Match.insertMany(matchDocs);
console.log(`✅ ${matchDocs.length} partite NB I create (giornate 1-31)`);

// ── NB II 2025/26 ────────────────────────────────────────────────────────────
const nb2TeamsData = [
  { shortName: 'VAS', name: 'Vasas',         city: 'Budapest',     founded: 1910, stadium: 'Illovszky Rudolf Stadion', capacity: 8000,  primaryColor: '#DC143C', secondaryColor: '#000000' },
  { shortName: 'HON', name: 'Honvéd FC',     city: 'Budapest',     founded: 1909, stadium: 'Bozsik Aréna',            capacity: 8100,  primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { shortName: 'KEC', name: 'Kecskeméti TE', city: 'Kecskemét',    founded: 1911, stadium: 'Széktói Stadion',         capacity: 8000,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'MEZ', name: 'Mezőkövesd',    city: 'Mezőkövesd',   founded: 1975, stadium: 'Mezőkövesd Stadion',      capacity: 5000,  primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { shortName: 'CSA', name: 'Csákvár',       city: 'Csákvár',      founded: 1920, stadium: 'Csákvári Stadion',        capacity: 3000,  primaryColor: '#003DA5', secondaryColor: '#FFD700' },
  { shortName: 'VID', name: 'Videoton',      city: 'Székesfehérvár',founded: 1941, stadium: 'Sóstói Stadion',         capacity: 14200, primaryColor: '#DC143C', secondaryColor: '#003DA5' },
  { shortName: 'KOZ', name: 'Kozármisleny',  city: 'Kozármisleny', founded: 1960, stadium: 'Kozármisleny Stadion',    capacity: 3000,  primaryColor: '#E30613', secondaryColor: '#000000' },
  { shortName: 'KAR', name: 'Karcag',        city: 'Karcag',       founded: 1921, stadium: 'Karcagi SE Stadion',      capacity: 4000,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'BVS', name: 'BVSC-Zugló',    city: 'Budapest',     founded: 1911, stadium: 'BVSC Stadion',            capacity: 3500,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'AJK', name: 'Ajka',          city: 'Ajka',         founded: 1926, stadium: 'Ajkai Városi Stadion',    capacity: 3500,  primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
  { shortName: 'TIS', name: 'Tiszakécske',   city: 'Tiszakécske',  founded: 1921, stadium: 'Tiszakécskei Stadion',    capacity: 3000,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'SZE', name: 'Szeged',        city: 'Szeged',       founded: 2019, stadium: 'Pick Aréna',              capacity: 8400,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'SOR', name: 'Soroksár',      city: 'Budapest',     founded: 1910, stadium: 'Soroksári Stadion',       capacity: 3000,  primaryColor: '#006400', secondaryColor: '#FFFFFF' },
  { shortName: 'BUD', name: 'Budafok',       city: 'Budapest',     founded: 1907, stadium: 'Budafoki MTE Stadion',    capacity: 3500,  primaryColor: '#E30613', secondaryColor: '#000000' },
  { shortName: 'BEK', name: 'Békéscsaba',    city: 'Békéscsaba',   founded: 1912, stadium: 'Salamon Stadion',         capacity: 5000,  primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },
  { shortName: 'SZL', name: 'Szentlőrinc',   city: 'Szentlőrinc',  founded: 1924, stadium: 'Szentlőrinci Stadion',    capacity: 2500,  primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
];
const nb2Teams = await Team.insertMany(nb2TeamsData.map(t => ({ ...t, leagues: [nb2._id], active: true })));
console.log(`✅ ${nb2Teams.length} squadre NB II create`);

const T2 = Object.fromEntries(nb2Teams.map(t => [t.shortName, t]));

const nb2Season = await Season.create({
  name: '2025-26',
  league: nb2._id,
  startDate: new Date('2025-07-27'),
  endDate: new Date('2026-06-30'),
  active: true,
});
console.log('✅ Stagione NB II 2025-26 creata');

const NB2_MATCHES_RAW = [
  // 1. forduló
  [1,  '2025-07-28T19:00:00', 'VID', 0, 3, 'HON'],
  [1,  '2025-07-27T17:00:00', 'BVS', 4, 0, 'AJK'],
  [1,  '2025-07-27T17:00:00', 'KOZ', 0, 2, 'TIS'],
  [1,  '2025-07-27T17:00:00', 'SOR', 1, 1, 'BEK'],
  [1,  '2025-07-27T17:00:00', 'SZE', 1, 0, 'KEC'],
  [1,  '2025-07-27T17:00:00', 'VAS', 1, 4, 'CSA'],
  [1,  '2025-07-27T17:00:00', 'BUD', 1, 1, 'SZL'],
  [1,  '2025-07-27T17:00:00', 'MEZ', 2, 0, 'KAR'],
  // 2. forduló
  [2,  '2025-08-04T17:00:00', 'KEC', 1, 2, 'VAS'],
  [2,  '2025-08-03T17:00:00', 'AJK', 1, 1, 'VID'],
  [2,  '2025-08-03T17:00:00', 'BEK', 1, 1, 'SZE'],
  [2,  '2025-08-03T17:00:00', 'CSA', 2, 0, 'BVS'],
  [2,  '2025-08-03T17:00:00', 'HON', 3, 0, 'BUD'],
  [2,  '2025-08-03T17:00:00', 'TIS', 1, 1, 'MEZ'],
  [2,  '2025-08-03T17:00:00', 'KAR', 3, 2, 'SOR'],
  [2,  '2025-08-03T17:00:00', 'SZL', 1, 1, 'KOZ'],
  // 3. forduló
  [3,  '2025-08-11T17:00:00', 'VAS', 4, 3, 'BEK'],
  [3,  '2025-08-10T17:00:00', 'BUD', 0, 1, 'AJK'],
  [3,  '2025-08-10T17:00:00', 'BVS', 0, 1, 'KEC'],
  [3,  '2025-08-10T17:00:00', 'SOR', 2, 2, 'TIS'],
  [3,  '2025-08-10T17:00:00', 'SZE', 2, 2, 'KAR'],
  [3,  '2025-08-10T17:00:00', 'MEZ', 2, 0, 'KOZ'],
  [3,  '2025-08-10T17:00:00', 'SZL', 1, 2, 'HON'],
  [3,  '2025-08-10T17:00:00', 'VID', 0, 0, 'CSA'],
  // 4. forduló
  [4,  '2025-08-18T17:00:00', 'KEC', 3, 1, 'VID'],
  [4,  '2025-08-17T17:00:00', 'AJK', 1, 0, 'HON'],
  [4,  '2025-08-17T17:00:00', 'BEK', 2, 1, 'BVS'],
  [4,  '2025-08-17T17:00:00', 'CSA', 2, 0, 'BUD'],
  [4,  '2025-08-17T17:00:00', 'KOZ', 1, 1, 'SOR'],
  [4,  '2025-08-17T17:00:00', 'TIS', 1, 4, 'SZE'],
  [4,  '2025-08-17T17:00:00', 'KAR', 1, 0, 'VAS'],
  [4,  '2025-08-17T17:00:00', 'MEZ', 0, 3, 'SZL'],
  // 5. forduló
  [5,  '2025-08-25T17:00:00', 'VAS', 1, 0, 'TIS'],
  [5,  '2025-08-24T17:00:00', 'BVS', 1, 1, 'KAR'],
  [5,  '2025-08-24T17:00:00', 'SOR', 1, 5, 'MEZ'],
  [5,  '2025-08-24T17:00:00', 'SZE', 1, 0, 'KOZ'],
  [5,  '2025-08-24T17:00:00', 'VID', 2, 0, 'BEK'],
  [5,  '2025-08-24T17:00:00', 'HON', 3, 1, 'CSA'],
  [5,  '2025-08-24T17:00:00', 'BUD', 2, 0, 'KEC'],
  [5,  '2025-08-24T17:00:00', 'SZL', 1, 0, 'AJK'],
  // 6. forduló
  [6,  '2025-09-17T19:00:00', 'KEC', 1, 0, 'HON'],
  [6,  '2025-08-31T17:00:00', 'BEK', 2, 0, 'BUD'],
  [6,  '2025-08-31T17:00:00', 'CSA', 1, 0, 'AJK'],
  [6,  '2025-08-31T17:00:00', 'KOZ', 0, 4, 'VAS'],
  [6,  '2025-08-31T17:00:00', 'SOR', 2, 1, 'SZL'],
  [6,  '2025-08-31T17:00:00', 'TIS', 1, 0, 'BVS'],
  [6,  '2025-08-31T17:00:00', 'MEZ', 1, 0, 'SZE'],
  [6,  '2025-08-31T17:00:00', 'KAR', 1, 0, 'VID'],
  // 7. forduló
  [7,  '2025-09-22T17:00:00', 'VAS', 4, 3, 'MEZ'],
  [7,  '2025-09-21T17:00:00', 'HON', 2, 1, 'BEK'],
  [7,  '2025-09-21T17:00:00', 'AJK', 1, 3, 'KEC'],
  [7,  '2025-09-21T17:00:00', 'SZE', 0, 3, 'SOR'],
  [7,  '2025-09-21T17:00:00', 'VID', 5, 0, 'TIS'],
  [7,  '2025-09-21T17:00:00', 'BUD', 0, 0, 'KAR'],
  [7,  '2025-09-21T17:00:00', 'SZL', 0, 0, 'CSA'],
  [7,  '2025-09-20T17:00:00', 'BVS', 0, 1, 'KOZ'],
  // 8. forduló
  [8,  '2025-09-29T19:00:00', 'HON', 5, 2, 'KAR'],
  [8,  '2025-09-28T17:00:00', 'BEK', 0, 2, 'AJK'],
  [8,  '2025-09-28T17:00:00', 'KEC', 2, 2, 'CSA'],
  [8,  '2025-09-28T17:00:00', 'SOR', 0, 2, 'VAS'],
  [8,  '2025-09-28T17:00:00', 'TIS', 1, 2, 'BUD'],
  [8,  '2025-09-28T17:00:00', 'KOZ', 1, 1, 'VID'],
  [8,  '2025-09-28T17:00:00', 'SZE', 2, 0, 'SZL'],
  [8,  '2025-09-28T17:00:00', 'MEZ', 1, 0, 'BVS'],
  // 9. forduló
  [9,  '2025-10-05T17:00:00', 'AJK', 0, 1, 'KAR'],
  [9,  '2025-10-05T17:00:00', 'CSA', 1, 1, 'BEK'],
  [9,  '2025-10-05T17:00:00', 'HON', 1, 1, 'TIS'],
  [9,  '2025-10-05T17:00:00', 'VAS', 0, 0, 'SZE'],
  [9,  '2025-10-05T17:00:00', 'VID', 1, 1, 'MEZ'],
  [9,  '2025-10-05T17:00:00', 'BUD', 2, 2, 'KOZ'],
  [9,  '2025-10-05T17:00:00', 'BVS', 2, 1, 'SOR'],
  [9,  '2025-10-05T17:00:00', 'SZL', 3, 4, 'KEC'],
  // 10. forduló
  [10, '2025-10-20T17:00:00', 'BEK', 1, 1, 'KEC'],
  [10, '2025-10-19T17:00:00', 'KOZ', 2, 1, 'HON'],
  [10, '2025-10-19T17:00:00', 'SOR', 3, 1, 'VID'],
  [10, '2025-10-19T17:00:00', 'SZE', 2, 1, 'BVS'],
  [10, '2025-10-19T17:00:00', 'TIS', 2, 1, 'AJK'],
  [10, '2025-10-19T17:00:00', 'VAS', 1, 0, 'SZL'],
  [10, '2025-10-19T17:00:00', 'KAR', 1, 0, 'CSA'],
  [10, '2025-10-17T17:00:00', 'MEZ', 1, 0, 'BUD'],
  // 11. forduló
  [11, '2025-10-26T17:00:00', 'AJK', 0, 2, 'KOZ'],
  [11, '2025-10-26T17:00:00', 'CSA', 3, 1, 'TIS'],
  [11, '2025-10-26T17:00:00', 'HON', 5, 2, 'MEZ'],
  [11, '2025-10-26T17:00:00', 'KEC', 2, 0, 'KAR'],
  [11, '2025-10-26T17:00:00', 'BVS', 0, 0, 'VAS'],
  [11, '2025-10-26T17:00:00', 'SZL', 2, 2, 'BEK'],
  [11, '2025-10-25T17:00:00', 'VID', 1, 0, 'SZE'],
  [11, '2025-11-15T17:00:00', 'BUD', 2, 2, 'SOR'],
  // 12. forduló
  [12, '2025-11-03T17:00:00', 'VAS', 2, 0, 'VID'],
  [12, '2025-11-02T17:00:00', 'AJK', 1, 2, 'MEZ'],
  [12, '2025-11-02T17:00:00', 'SOR', 0, 1, 'HON'],
  [12, '2025-11-02T17:00:00', 'TIS', 2, 1, 'KEC'],
  [12, '2025-11-02T17:00:00', 'KOZ', 2, 2, 'CSA'],
  [12, '2025-11-02T17:00:00', 'SZE', 4, 0, 'BUD'],
  [12, '2025-11-02T17:00:00', 'BVS', 2, 1, 'SZL'],
  [12, '2025-11-02T17:00:00', 'KAR', 4, 2, 'BEK'],
  // 13. forduló
  [13, '2025-11-09T17:00:00', 'AJK', 2, 1, 'SOR'],
  [13, '2025-11-09T17:00:00', 'BEK', 0, 3, 'TIS'],
  [13, '2025-11-09T17:00:00', 'CSA', 2, 1, 'MEZ'],
  [13, '2025-11-09T17:00:00', 'HON', 0, 0, 'SZE'],
  [13, '2025-11-09T17:00:00', 'KEC', 3, 0, 'KOZ'],
  [13, '2025-11-09T17:00:00', 'VID', 0, 1, 'BVS'],
  [13, '2025-11-09T17:00:00', 'BUD', 0, 3, 'VAS'],
  [13, '2025-11-09T17:00:00', 'SZL', 1, 1, 'KAR'],
  // 14. forduló
  [14, '2025-11-24T17:00:00', 'VAS', 1, 2, 'HON'],
  [14, '2025-11-23T17:00:00', 'SOR', 0, 1, 'CSA'],
  [14, '2025-11-23T17:00:00', 'TIS', 1, 1, 'KAR'],
  [14, '2025-11-23T17:00:00', 'SZE', 0, 1, 'AJK'],
  [14, '2025-11-23T17:00:00', 'VID', 0, 0, 'SZL'],
  [14, '2025-11-23T17:00:00', 'BVS', 0, 2, 'BUD'],
  [14, '2025-11-23T17:00:00', 'KOZ', 3, 0, 'BEK'],
  [14, '2025-11-23T17:00:00', 'MEZ', 1, 1, 'KEC'],
  // 15. forduló
  [15, '2025-11-30T17:00:00', 'BEK', 0, 0, 'MEZ'],
  [15, '2025-11-30T17:00:00', 'CSA', 1, 1, 'SZE'],
  [15, '2025-11-30T17:00:00', 'HON', 3, 0, 'BVS'],
  [15, '2025-11-30T17:00:00', 'KEC', 2, 1, 'SOR'],
  [15, '2025-11-30T17:00:00', 'AJK', 1, 0, 'VAS'],
  [15, '2025-11-30T17:00:00', 'BUD', 2, 2, 'VID'],
  [15, '2025-11-30T17:00:00', 'KAR', 1, 1, 'KOZ'],
  [15, '2025-11-30T17:00:00', 'SZL', 1, 1, 'TIS'],
  // 16. forduló
  [16, '2026-02-02T19:00:00', 'HON', 2, 1, 'VID'],
  [16, '2026-02-01T15:00:00', 'AJK', 0, 2, 'BVS'],
  [16, '2026-02-01T15:00:00', 'CSA', 2, 2, 'VAS'],
  [16, '2026-02-01T15:00:00', 'KEC', 4, 0, 'SZE'],
  [16, '2026-02-01T14:00:00', 'BEK', 2, 1, 'SOR'],
  [16, '2026-02-01T14:00:00', 'KAR', 0, 3, 'MEZ'],
  [16, '2026-02-01T14:00:00', 'SZL', 5, 3, 'BUD'],
  [16, '2026-02-01T14:00:00', 'TIS', 0, 2, 'KOZ'],
  // 17. forduló
  [17, '2026-02-08T17:00:00', 'SOR', 1, 1, 'KAR'],
  [17, '2026-02-08T17:00:00', 'SZE', 1, 1, 'BEK'],
  [17, '2026-02-08T17:00:00', 'VAS', 2, 0, 'KEC'],
  [17, '2026-02-08T14:00:00', 'BUD', 1, 1, 'HON'],
  [17, '2026-02-08T14:00:00', 'KOZ', 0, 0, 'SZL'],
  [17, '2026-02-08T14:00:00', 'MEZ', 1, 0, 'TIS'],
  [17, '2026-02-07T15:00:00', 'VID', 1, 0, 'AJK'],
  [17, '2026-02-07T14:00:00', 'BVS', 1, 1, 'CSA'],
  // 18. forduló
  [18, '2026-02-15T17:00:00', 'HON', 2, 1, 'SZL'],
  [18, '2026-02-15T15:00:00', 'AJK', 0, 1, 'BUD'],
  [18, '2026-02-15T15:00:00', 'CSA', 1, 5, 'VID'],
  [18, '2026-02-15T15:00:00', 'KEC', 0, 2, 'BVS'],
  [18, '2026-02-15T14:00:00', 'BEK', 0, 1, 'VAS'],
  [18, '2026-02-15T14:00:00', 'KAR', 1, 0, 'SZE'],
  [18, '2026-02-15T14:00:00', 'KOZ', 3, 0, 'MEZ'],
  [18, '2026-02-15T14:00:00', 'TIS', 3, 2, 'SOR'],
  // 19. forduló
  [19, '2026-02-23T17:45:00', 'VID', 2, 1, 'KEC'],
  [19, '2026-02-22T17:00:00', 'HON', 1, 0, 'AJK'],
  [19, '2026-02-22T17:00:00', 'SOR', 3, 2, 'KOZ'],
  [19, '2026-02-22T15:00:00', 'SZE', 1, 1, 'TIS'],
  [19, '2026-02-22T15:00:00', 'VAS', 2, 0, 'KAR'],
  [19, '2026-02-22T14:00:00', 'BUD', 2, 0, 'CSA'],
  [19, '2026-02-22T14:00:00', 'BVS', 0, 1, 'BEK'],
  [19, '2026-02-22T14:00:00', 'SZL', 1, 1, 'MEZ'],
  // 20. forduló
  [20, '2026-03-02T19:00:00', 'BEK', 0, 1, 'VID'],
  [20, '2026-03-01T15:00:00', 'AJK', 2, 1, 'SZL'],
  [20, '2026-03-01T15:00:00', 'TIS', 0, 0, 'VAS'],
  [20, '2026-03-01T14:00:00', 'KAR', 1, 3, 'BVS'],
  [20, '2026-03-01T14:00:00', 'KOZ', 2, 1, 'SZE'],
  [20, '2026-02-28T15:00:00', 'CSA', 0, 2, 'HON'],
  [20, '2026-02-28T15:00:00', 'KEC', 2, 1, 'BUD'],
  [20, '2026-02-28T14:00:00', 'MEZ', 0, 0, 'SOR'],
  // 21. forduló
  [21, '2026-03-09T19:00:00', 'HON', 0, 1, 'KEC'],
  [21, '2026-03-08T15:00:00', 'AJK', 1, 2, 'CSA'],
  [21, '2026-03-08T15:00:00', 'SZE', 1, 2, 'MEZ'],
  [21, '2026-03-08T15:00:00', 'VAS', 6, 0, 'KOZ'],
  [21, '2026-03-08T15:00:00', 'VID', 2, 0, 'KAR'],
  [21, '2026-03-08T14:00:00', 'BUD', 0, 3, 'BEK'],
  [21, '2026-03-08T14:00:00', 'BVS', 3, 1, 'TIS'],
  [21, '2026-03-08T14:00:00', 'SZL', 2, 2, 'SOR'],
  // 22. forduló
  [22, '2026-03-16T19:00:00', 'MEZ', 0, 2, 'VAS'],
  [22, '2026-03-14T17:00:00', 'SOR', 0, 1, 'SZE'],
  [22, '2026-03-14T15:00:00', 'CSA', 2, 2, 'SZL'],
  [22, '2026-03-14T15:00:00', 'KEC', 0, 1, 'AJK'],
  [22, '2026-03-14T15:00:00', 'KOZ', 0, 3, 'BVS'],
  [22, '2026-03-14T15:00:00', 'TIS', 1, 1, 'VID'],
  [22, '2026-03-14T14:00:00', 'BEK', 0, 2, 'HON'],
  [22, '2026-03-14T14:00:00', 'KAR', 3, 2, 'BUD'],
  // 23. forduló
  [23, '2026-03-22T17:00:00', 'VAS', 3, 1, 'SOR'],
  [23, '2026-03-22T15:00:00', 'AJK', 1, 0, 'BEK'],
  [23, '2026-03-22T15:00:00', 'CSA', 6, 1, 'KEC'],
  [23, '2026-03-22T15:00:00', 'VID', 1, 1, 'KOZ'],
  [23, '2026-03-22T14:00:00', 'BUD', 1, 1, 'TIS'],
  [23, '2026-03-22T14:00:00', 'BVS', 0, 1, 'MEZ'],
  [23, '2026-03-22T14:00:00', 'KAR', 0, 1, 'HON'],
  [23, '2026-03-22T14:00:00', 'SZL', 0, 2, 'SZE'],
  // 24. forduló
  [24, '2026-04-05T19:00:00', 'BEK', 2, 2, 'CSA'],
  [24, '2026-04-05T19:00:00', 'SOR', 2, 1, 'BVS'],
  [24, '2026-04-05T17:00:00', 'KEC', 3, 0, 'SZL'],
  [24, '2026-04-05T17:00:00', 'KOZ', 1, 0, 'BUD'],
  [24, '2026-04-05T17:00:00', 'SZE', 0, 4, 'VAS'],
  [24, '2026-04-05T17:00:00', 'TIS', 1, 0, 'HON'],
  [24, '2026-04-05T16:00:00', 'KAR', 0, 1, 'AJK'],
  [24, '2026-04-05T16:00:00', 'MEZ', 0, 2, 'VID'],
  // 25. forduló
  [25, '2026-04-11T19:00:00', 'HON', 1, 2, 'KOZ'],
  [25, '2026-04-11T17:00:00', 'AJK', 1, 4, 'TIS'],
  [25, '2026-04-11T17:00:00', 'CSA', 1, 2, 'KAR'],
  [25, '2026-04-11T17:00:00', 'KEC', 2, 0, 'BEK'],
  [25, '2026-04-11T17:00:00', 'VID', 1, 1, 'SOR'],
  [25, '2026-04-11T16:00:00', 'BUD', 0, 2, 'MEZ'],
  [25, '2026-04-11T16:00:00', 'BVS', 1, 1, 'SZE'],
  [25, '2026-04-11T16:00:00', 'SZL', 0, 4, 'VAS'],
  // 26. forduló
  [26, '2026-04-20T19:00:00', 'VAS', 0, 2, 'BVS'],
  [26, '2026-04-19T19:00:00', 'BEK', 0, 0, 'SZL'],
  [26, '2026-04-19T19:00:00', 'SOR', 2, 1, 'BUD'],
  [26, '2026-04-19T17:00:00', 'KAR', 1, 2, 'KEC'],
  [26, '2026-04-19T17:00:00', 'KOZ', 1, 1, 'AJK'],
  [26, '2026-04-19T17:00:00', 'SZE', 0, 3, 'VID'],
  [26, '2026-04-19T17:00:00', 'TIS', 1, 2, 'CSA'],
  [26, '2026-04-18T14:00:00', 'MEZ', 1, 2, 'HON'],
  // 27. forduló
  [27, '2026-04-27T19:00:00', 'HON', 0, 0, 'SOR'],
  [27, '2026-04-26T19:00:00', 'BEK', 0, 0, 'KAR'],
  [27, '2026-04-26T17:00:00', 'BUD', 2, 0, 'SZE'],
  [27, '2026-04-26T17:00:00', 'CSA', 0, 2, 'KOZ'],
  [27, '2026-04-26T17:00:00', 'KEC', 5, 1, 'TIS'],
  [27, '2026-04-26T17:00:00', 'MEZ', 1, 1, 'AJK'],
  [27, '2026-04-26T17:00:00', 'SZL', 2, 0, 'BVS'],
  [27, '2026-04-26T17:00:00', 'VID', 0, 2, 'VAS'],
];

const nb2MatchDocs = NB2_MATCHES_RAW.map(([matchday, dateStr, homeShort, homeScore, awayScore, awayShort]) => ({
  homeTeam: T2[homeShort]._id,
  awayTeam: T2[awayShort]._id,
  league: nb2._id,
  season: nb2Season._id,
  matchday,
  date: new Date(dateStr),
  venue: T2[homeShort].stadium || '',
  status: 'finished',
  homeScore,
  awayScore,
  events: [],
}));

await Match.insertMany(nb2MatchDocs);
console.log(`✅ ${nb2MatchDocs.length} partite NB II create (giornate 1-27)`);

const standingsData = [
  {
    leagueSlug: 'nb1', leagueName: 'Nemzeti Bajnokság I', leagueShort: 'NB I', season: '2024/25',
    standings: [
      { rank: 1,  team: { id: 1001, name: 'ETO FC Győr',            logo: '' }, all: { played: 31, win: 18, draw: 9,  lose: 4,  goals: { for: 60, against: 30 } }, goalsDiff: 30,  points: 63, form: 'DWWWW' },
      { rank: 2,  team: { id: 1002, name: 'Ferencvárosi TC',         logo: '' }, all: { played: 31, win: 19, draw: 5,  lose: 7,  goals: { for: 59, against: 31 } }, goalsDiff: 28,  points: 62, form: 'WLWWW' },
      { rank: 3,  team: { id: 1003, name: 'Debreceni VSC',           logo: '' }, all: { played: 31, win: 13, draw: 11, lose: 7,  goals: { for: 47, against: 35 } }, goalsDiff: 12,  points: 50, form: 'DWDLD' },
      { rank: 4,  team: { id: 1004, name: 'Zalaegerszegi TE FC',     logo: '' }, all: { played: 31, win: 13, draw: 9,  lose: 9,  goals: { for: 48, against: 37 } }, goalsDiff: 11,  points: 48, form: 'LWLWW' },
      { rank: 5,  team: { id: 1005, name: 'Paksi FC',                logo: '' }, all: { played: 31, win: 13, draw: 8,  lose: 10, goals: { for: 55, against: 43 } }, goalsDiff: 12,  points: 47, form: 'LWLWW' },
      { rank: 6,  team: { id: 1006, name: 'Puskás Akadémia FC',      logo: '' }, all: { played: 31, win: 12, draw: 6,  lose: 13, goals: { for: 38, against: 40 } }, goalsDiff: -2,  points: 42, form: 'WLLLW' },
      { rank: 7,  team: { id: 1007, name: 'Újpest FC',               logo: '' }, all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 47, against: 50 } }, goalsDiff: -3,  points: 40, form: 'LWWDL' },
      { rank: 8,  team: { id: 1008, name: 'Kisvárda FC',             logo: '' }, all: { played: 31, win: 11, draw: 7,  lose: 13, goals: { for: 35, against: 46 } }, goalsDiff: -11, points: 40, form: 'LLDLD' },
      { rank: 9,  team: { id: 1009, name: 'Nyíregyháza Spartacus',   logo: '' }, all: { played: 31, win: 10, draw: 8,  lose: 13, goals: { for: 44, against: 54 } }, goalsDiff: -10, points: 38, form: 'WLWLW' },
      { rank: 10, team: { id: 1010, name: 'MTK Budapest FC',         logo: '' }, all: { played: 31, win: 9,  draw: 9,  lose: 13, goals: { for: 52, against: 59 } }, goalsDiff: -7,  points: 36, form: 'DWWDL' },
      { rank: 11, team: { id: 1011, name: 'Diósgyőri VTK',          logo: '' }, all: { played: 31, win: 6,  draw: 10, lose: 15, goals: { for: 38, against: 58 } }, goalsDiff: -20, points: 28, form: 'WLLLL' },
      { rank: 12, team: { id: 1012, name: 'FC Kazincbarcika',        logo: '' }, all: { played: 31, win: 5,  draw: 3,  lose: 23, goals: { for: 27, against: 67 } }, goalsDiff: -40, points: 18, form: 'DLLLL' },
    ],
  },
  {
    leagueSlug: 'nb2', leagueName: 'Nemzeti Bajnokság II', leagueShort: 'NB II', season: '2025/26',
    standings: [
      { rank: 1,  team: { id: 2001, name: 'Vasas' },         all: { played: 27, win: 18, draw: 4,  lose: 5,  goals: { for: 53, against: 20 } }, goalsDiff: 33,  points: 58, form: 'WLWWW' },
      { rank: 2,  team: { id: 2002, name: 'Honvéd FC' },     all: { played: 27, win: 17, draw: 4,  lose: 6,  goals: { for: 45, against: 21 } }, goalsDiff: 24,  points: 55, form: 'DLWWW' },
      { rank: 3,  team: { id: 2003, name: 'Kecskeméti TE' }, all: { played: 27, win: 15, draw: 3,  lose: 9,  goals: { for: 46, against: 33 } }, goalsDiff: 13,  points: 48, form: 'WWWWL' },
      { rank: 4,  team: { id: 2004, name: 'Mezőkövesd' },    all: { played: 27, win: 12, draw: 7,  lose: 8,  goals: { for: 35, against: 31 } }, goalsDiff: 4,   points: 43, form: 'DLWLW' },
      { rank: 5,  team: { id: 2005, name: 'Csákvár' },       all: { played: 27, win: 10, draw: 10, lose: 7,  goals: { for: 41, against: 36 } }, goalsDiff: 5,   points: 40, form: 'LWLDW' },
      { rank: 6,  team: { id: 2006, name: 'Videoton' },      all: { played: 27, win: 10, draw: 9,  lose: 8,  goals: { for: 35, against: 27 } }, goalsDiff: 8,   points: 39, form: 'LWDWD' },
      { rank: 7,  team: { id: 2007, name: 'Kozármisleny' },  all: { played: 27, win: 10, draw: 9,  lose: 8,  goals: { for: 32, against: 37 } }, goalsDiff: -5,  points: 39, form: 'WDWWD' },
      { rank: 8,  team: { id: 2008, name: 'Karcag' },        all: { played: 27, win: 9,  draw: 8,  lose: 10, goals: { for: 28, against: 37 } }, goalsDiff: -9,  points: 35, form: 'DWLLL' },
      { rank: 9,  team: { id: 2009, name: 'BVSC-Zugló' },    all: { played: 27, win: 10, draw: 4,  lose: 13, goals: { for: 30, against: 28 } }, goalsDiff: 2,   points: 34, form: 'LWDLL' },
      { rank: 10, team: { id: 2010, name: 'Ajka' },          all: { played: 27, win: 10, draw: 3,  lose: 14, goals: { for: 21, against: 32 } }, goalsDiff: -11, points: 33, form: 'DDLWW' },
      { rank: 11, team: { id: 2011, name: 'Tiszakécske' },   all: { played: 27, win: 8,  draw: 9,  lose: 10, goals: { for: 33, against: 42 } }, goalsDiff: -9,  points: 33, form: 'LWWWD' },
      { rank: 12, team: { id: 2012, name: 'Szeged' },        all: { played: 27, win: 8,  draw: 8,  lose: 11, goals: { for: 26, against: 33 } }, goalsDiff: -7,  points: 32, form: 'LLDLW' },
      { rank: 13, team: { id: 2013, name: 'Soroksár' },      all: { played: 27, win: 6,  draw: 9,  lose: 12, goals: { for: 35, against: 43 } }, goalsDiff: -8,  points: 27, form: 'WDWLL' },
      { rank: 14, team: { id: 2014, name: 'Budafok' },       all: { played: 27, win: 6,  draw: 7,  lose: 14, goals: { for: 27, against: 44 } }, goalsDiff: -17, points: 25, form: 'WLLLD' },
      { rank: 15, team: { id: 2015, name: 'Békéscsaba' },    all: { played: 27, win: 5,  draw: 10, lose: 12, goals: { for: 25, against: 38 } }, goalsDiff: -13, points: 25, form: 'DDDLD' },
      { rank: 16, team: { id: 2016, name: 'Szentlőrinc' },   all: { played: 27, win: 4,  draw: 12, lose: 11, goals: { for: 30, against: 40 } }, goalsDiff: -10, points: 24, form: 'WDLLL' },
    ],
  },
  {
    leagueSlug: 'u19', leagueName: 'U19 Nemzeti Bajnokság', leagueShort: 'U19', season: '2024/25',
    standings: [
      { rank: 1,  team: { id: 3001, name: 'Budapest Honvéd U19',                  logo: '' }, all: { played: 17, win: 14, draw: 1, lose: 2,  goals: { for: 53, against: 8  } }, goalsDiff: 45,  points: 43, form: 'WWWWW' },
      { rank: 2,  team: { id: 3002, name: 'MTK Budapest U19',                     logo: '' }, all: { played: 16, win: 14, draw: 0, lose: 2,  goals: { for: 51, against: 20 } }, goalsDiff: 31,  points: 42, form: 'WWWWW' },
      { rank: 3,  team: { id: 3003, name: 'Debreceni VSC U19',                    logo: '' }, all: { played: 15, win: 8,  draw: 0, lose: 7,  goals: { for: 35, against: 23 } }, goalsDiff: 12,  points: 24, form: 'WLWLW' },
      { rank: 4,  team: { id: 3004, name: 'Illés Akadémia Haladás U19',          logo: '' }, all: { played: 17, win: 6,  draw: 6, lose: 5,  goals: { for: 24, against: 27 } }, goalsDiff: -3,  points: 24, form: 'LWWDL' },
      { rank: 5,  team: { id: 3005, name: 'Ferencvárosi TC U19',                 logo: '' }, all: { played: 16, win: 7,  draw: 2, lose: 7,  goals: { for: 31, against: 34 } }, goalsDiff: -3,  points: 23, form: 'DWLWW' },
      { rank: 6,  team: { id: 3006, name: 'Diósgyőri VTK U19',                  logo: '' }, all: { played: 15, win: 6,  draw: 4, lose: 5,  goals: { for: 24, against: 24 } }, goalsDiff: 0,   points: 22, form: 'DWWLW' },
      { rank: 7,  team: { id: 3007, name: 'Puskás Akadémia U19',                 logo: '' }, all: { played: 16, win: 7,  draw: 1, lose: 8,  goals: { for: 31, against: 35 } }, goalsDiff: -4,  points: 22, form: 'LWLLL' },
      { rank: 8,  team: { id: 3008, name: 'Győri ETO U19',                       logo: '' }, all: { played: 16, win: 5,  draw: 4, lose: 7,  goals: { for: 29, against: 26 } }, goalsDiff: 3,   points: 19, form: 'DWLWL' },
      { rank: 9,  team: { id: 3009, name: 'Kubala Akadémia U19',                 logo: '' }, all: { played: 16, win: 4,  draw: 4, lose: 8,  goals: { for: 18, against: 28 } }, goalsDiff: -10, points: 16, form: 'WLDLL' },
      { rank: 10, team: { id: 3010, name: 'Fehérvár FC U19',                     logo: '' }, all: { played: 16, win: 4,  draw: 3, lose: 9,  goals: { for: 15, against: 41 } }, goalsDiff: -26, points: 15, form: 'LLLLL' },
      { rank: 11, team: { id: 3011, name: 'Szeged-Csanád Grosics Akadémia U19', logo: '' }, all: { played: 16, win: 3,  draw: 4, lose: 9,  goals: { for: 17, against: 41 } }, goalsDiff: -24, points: 13, form: 'LLDWD' },
      { rank: 12, team: { id: 3012, name: 'Újpest FC U19',                       logo: '' }, all: { played: 16, win: 2,  draw: 3, lose: 11, goals: { for: 17, against: 38 } }, goalsDiff: -21, points: 9,  form: 'LLLLL' },
    ],
  },
];
await Standings.insertMany(standingsData);
console.log('✅ Classifiche NB I, NB II, U19 inserite nel DB');

console.log('\n🎉 Seed completato con successo!');
console.log('   Login admin: admin@magyardream.hu / admin123');
mongoose.disconnect();
