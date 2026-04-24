import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it, enUS, hu } from 'date-fns/locale';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const EVENT_ICONS = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  substitution: '🔄',
};

const DATE_LOCALES = { it, en: enUS, hu };

function TeamHeader({ team }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold"
        style={{ backgroundColor: team?.primaryColor || '#333' }}
      >
        {team?.logo ? (
          <img src={team.logo} alt={team.name} className="w-16 h-16 object-contain" />
        ) : (
          team?.shortName?.slice(0, 3)
        )}
      </div>
      <Link
        to={`/squadre/${team?._id}`}
        className="text-gray-900 font-bold text-lg text-center hover:text-brand-primary transition-colors"
      >
        {team?.name}
      </Link>
      <p className="text-brand-muted text-sm">{team?.city}</p>
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { data: match, loading, error } = useApi(`/matches/${id}`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!match) return null;

  const dateLocale = DATE_LOCALES[lang] || it;
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  const homeEvents = match.events?.filter(
    (ev) => ev.team?._id === match.homeTeam?._id || ev.team === match.homeTeam?._id
  ) || [];
  const awayEvents = match.events?.filter(
    (ev) => ev.team?._id === match.awayTeam?._id || ev.team === match.awayTeam?._id
  ) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="text-sm text-brand-muted mb-6">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        {' / '}
        <Link to="/risultati" className="hover:text-gray-900">{t.nav.results}</Link>
        {' / '}
        <span className="text-gray-300">{match.homeTeam?.shortName} vs {match.awayTeam?.shortName}</span>
      </div>

      <div className="text-center mb-2">
        <span className="text-xs text-brand-muted uppercase tracking-wider">
          {match.league?.name} · {t.match.matchday} {match.matchday} · {t.standings.season} {match.season?.name}
        </span>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-3 items-center gap-4">
          <TeamHeader team={match.homeTeam} />

          <div className="text-center">
            {isFinished || isLive ? (
              <div>
                <div className={`text-5xl font-extrabold tabular-nums ${isLive ? 'text-green-600' : 'text-gray-900'}`}>
                  {match.homeScore} – {match.awayScore}
                </div>
                {isLive && (
                  <p className="text-green-400 text-sm font-semibold animate-pulse mt-2">LIVE</p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-3xl font-bold text-brand-gold">
                  {format(new Date(match.date), 'HH:mm')}
                </p>
                <p className="text-brand-muted text-sm mt-1">
                  {format(new Date(match.date), 'd MMMM yyyy', { locale: dateLocale })}
                </p>
              </div>
            )}
            <p className="text-xs text-brand-muted mt-3 capitalize">
              {t.match[match.status] || match.status}
            </p>
          </div>

          <TeamHeader team={match.awayTeam} />
        </div>

        {(match.venue || match.date) && (
          <div className="border-t border-brand-border mt-5 pt-4 flex flex-wrap justify-center gap-6 text-sm text-brand-muted">
            {match.venue && (
              <span>🏟️ {match.venue}</span>
            )}
            {match.date && (
              <span>📅 {format(new Date(match.date), 'EEEE d MMMM yyyy HH:mm', { locale: dateLocale })}</span>
            )}
          </div>
        )}
      </div>

      {match.events && match.events.length > 0 ? (
        <div className="card p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t.match.events}</h2>
          <div className="space-y-2">
            {[...match.events]
              .sort((a, b) => a.minute - b.minute)
              .map((ev, idx) => {
                const isHome =
                  ev.team?._id === match.homeTeam?._id || ev.team === match.homeTeam?._id;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 ${isHome ? '' : 'flex-row-reverse'}`}
                  >
                    <span className="text-brand-muted text-xs w-12 text-center shrink-0">
                      {ev.minute}'
                    </span>
                    <span className="text-lg shrink-0">{EVENT_ICONS[ev.type] || '•'}</span>
                    <div className={`flex-1 ${isHome ? 'text-left' : 'text-right'}`}>
                      <span className="text-gray-900 text-sm font-medium">
                        {ev.player ? `${ev.player.firstName} ${ev.player.lastName}` : '—'}
                      </span>
                      {ev.type === 'substitution' && ev.player2 && (
                        <span className="text-brand-muted text-xs">
                          {' '}↕ {ev.player2.firstName} {ev.player2.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : isFinished ? (
        <div className="card p-5 mb-6 text-center text-brand-muted text-sm">
          {t.match.noEvents}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <Link
          to={`/squadre/${match.homeTeam?._id}`}
          className="btn-secondary text-center py-3"
        >
          → {match.homeTeam?.shortName}
        </Link>
        <Link
          to={`/squadre/${match.awayTeam?._id}`}
          className="btn-secondary text-center py-3"
        >
          → {match.awayTeam?.shortName}
        </Link>
      </div>

    </div>
  );
}
