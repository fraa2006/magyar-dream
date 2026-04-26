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
  { name: 'Nemzeti Bajnokság I',   shortName: 'NB I',  slug: 'nb1',         tier: 1 },
  { name: 'Nemzeti Bajnokság II',  shortName: 'NB II', slug: 'nb2',         tier: 2 },
  { name: 'Nemzeti Bajnokság III', shortName: 'NB III',slug: 'nb3',         tier: 3 },
  { name: 'Magyar Kupa',           shortName: 'MK',    slug: 'magyar-kupa', tier: 1 },
  { name: 'U19 Nemzeti Bajnokság', shortName: 'U19',   slug: 'u19',         tier: 4 },
];
const leagues = await League.insertMany(leaguesData);
const nb1 = leagues[0];
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

console.log('\n🎉 Seed completato con successo!');
console.log('   Login admin: admin@magyardream.hu / admin123');
mongoose.disconnect();
