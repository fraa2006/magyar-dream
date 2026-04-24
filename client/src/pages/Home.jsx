import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

function SectionHeader({ title, link, linkLabel }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {link && (
        <Link to={link} className="text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors uppercase tracking-wider">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="card py-10 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-brand-muted text-sm">{text}</p>
    </div>
  );
}

const LEAGUES = [
  { slug: 'nb1', name: 'NB I', color: '#477050', descs: { it: '1ª Divisione', en: '1st Division', hu: '1. Osztály' } },
  { slug: 'nb2', name: 'NB II', color: '#CE2939', descs: { it: '2ª Divisione', en: '2nd Division', hu: '2. Osztály' } },
  { slug: 'u19', name: 'U19', color: '#E8A020', descs: { it: 'Primavera', en: 'Youth U19', hu: 'U19 Liga' } },
];

export default function Home() {
  const { t, lang } = useLanguage();

  const { weekAgoISO, todayISO, nextWeekISO } = useMemo(() => {
    const now = new Date();
    const wa = new Date(now); wa.setDate(now.getDate() - 7);
    const nw = new Date(now); nw.setDate(now.getDate() + 7);
    return { weekAgoISO: wa.toISOString(), todayISO: now.toISOString(), nextWeekISO: nw.toISOString() };
  }, []);

  const { data: recentMatches, loading: loadingRecent } = useApi('/matches', {
    status: 'finished', from: weekAgoISO, limit: 5,
  });
  const { data: upcomingMatches, loading: loadingUpcoming } = useApi('/matches', {
    status: 'scheduled', from: todayISO, to: nextWeekISO, limit: 5,
  });
  const { data: standingsData, loading: loadingStandings } = useApi('/live/nb1');
  const { data: scorersData } = useApi('/standings/nb1/scorers');

  const STATS = [
    { value: '3', label: t.home.statLeagues },
    { value: '24', label: t.home.statTeams },
    { value: '2024/25', label: t.home.statSeason },
    { value: '🇭🇺', label: t.home.statCountry },
  ];

  return (
    <div className="animate-fade-in">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-white border-b border-brand-border">
        <div className="absolute inset-0 flex pointer-events-none select-none">
          <div className="flex-1 bg-hungarian-red opacity-[0.04]" />
          <div className="flex-1 bg-white opacity-[0.01]" />
          <div className="flex-1 bg-hungarian-green opacity-[0.04]" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-brand-border rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm">🇭🇺</span>
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">{t.home.badge}</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold leading-none mb-4 tracking-tight">
            <span className="text-hungarian-green">Magyar</span>{' '}
            <span className="text-hungarian-red">Dream</span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/classifica" className="btn-primary px-7 py-3 text-base glow-red-sm">
              {t.home.btnStandings}
            </Link>
            <Link to="/risultati" className="btn-secondary px-7 py-3 text-base">
              {t.home.btnResults}
            </Link>
            <Link to="/marcatori/nb1" className="btn-secondary px-7 py-3 text-base">
              {t.home.btnScorers}
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="border-b border-brand-border bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="py-5 px-6 text-center">
                <div className="text-2xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs text-brand-muted mt-1 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Leagues strip */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {LEAGUES.map(({ slug, name, color, descs: d }) => (
            <Link key={slug} to={`/classifica/${slug}`} className="group card-hover p-4 text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-extrabold transition-transform group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: color }}
              >
                {name}
              </div>
              <p className="text-xs font-semibold text-gray-700">{name}</p>
              <p className="text-[11px] text-brand-muted">{d[lang] || d.it}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <SectionHeader title={t.home.recentResults} link="/risultati" linkLabel={t.home.seeAll} />
              {loadingRecent ? <LoadingSpinner /> : (
                recentMatches?.length
                  ? <div className="space-y-1.5">{recentMatches.map(m => <MatchCard key={m._id} match={m} />)}</div>
                  : <EmptyState icon="⚽" text={t.home.noResults} />
              )}
            </section>

            <section>
              <SectionHeader title={t.home.upcoming} link="/calendario" linkLabel={t.home.calendar} />
              {loadingUpcoming ? <LoadingSpinner /> : (
                upcomingMatches?.length
                  ? <div className="space-y-1.5">{upcomingMatches.map(m => <MatchCard key={m._id} match={m} />)}</div>
                  : <EmptyState icon="📅" text={t.home.noUpcoming} />
              )}
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <section>
              <SectionHeader title={t.home.standingsNb1} link="/classifica" linkLabel={t.home.full} />
              {loadingStandings ? <LoadingSpinner /> : (
                <div className="card overflow-hidden">
                  <div className="px-3 py-2 border-b border-brand-border bg-gray-50/50 text-xs font-semibold text-brand-muted">
                    Nemzeti Bajnokság I · 2024/25
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {(standingsData?.standings || []).slice(0, 6).map((row, i) => (
                        <tr key={row.team?.id} className="border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-2 pl-3 pr-1 text-center w-6">
                            <span className={`text-xs font-bold ${i < 2 ? 'text-green-500' : 'text-brand-muted'}`}>{row.rank}</span>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              {row.team?.logo && <img src={row.team.logo} alt="" className="w-5 h-5 object-contain" />}
                              <span className="text-gray-900 font-medium truncate max-w-28 text-xs">{row.team?.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-1 text-center text-xs text-brand-muted">{row.all?.played}</td>
                          <td className="py-2 pr-3 text-center font-extrabold text-gray-900 text-sm">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {scorersData?.scorers?.length > 0 && (
              <section>
                <SectionHeader title={t.home.scorersNb1} link="/marcatori/nb1" linkLabel={t.home.all} />
                <div className="card divide-y divide-brand-border">
                  {scorersData.scorers.slice(0, 5).map((row, i) => (
                    <Link
                      key={row.player?._id}
                      to={`/giocatori/${row.player?._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-brand-muted font-bold text-sm w-5 text-center shrink-0">{i + 1}</span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: row.player?.team?.primaryColor || '#333' }}
                      >
                        {row.player?.photo
                          ? <img src={row.player.photo} className="w-8 h-8 rounded-full object-cover" alt="" />
                          : row.player?.firstName?.[0]
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm font-medium truncate">
                          {row.player?.firstName} {row.player?.lastName}
                        </p>
                        <p className="text-brand-muted text-xs truncate">{row.player?.team?.shortName}</p>
                      </div>
                      <div className="flex items-baseline gap-1 shrink-0">
                        <span className="text-xl font-extrabold text-brand-primary">{row.goals}</span>
                        <span className="text-xs text-brand-muted">⚽</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
