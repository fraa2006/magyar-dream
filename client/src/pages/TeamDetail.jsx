import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const POSITION_ORDER = ['GK', 'DF', 'MF', 'FW'];

const POSITION_COLORS = {
  GK: 'bg-yellow-100 text-yellow-700',
  DF: 'bg-blue-100 text-blue-700',
  MF: 'bg-green-100 text-green-700',
  FW: 'bg-red-100 text-red-700',
};

function StatPill({ value, icon, title, colorClass }) {
  if (!value) return null;
  return (
    <span title={title} className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${colorClass}`}>
      {icon} {value}
    </span>
  );
}

export default function TeamDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { data, loading, error } = useApi(`/teams/${id}`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const { team, players, recentMatches } = data;
  const POSITION_LABELS = t.player.positionsGroup;
  const S = t.player.stats;

  const playersByPosition = POSITION_ORDER.reduce((acc, pos) => {
    const group = players.filter((p) => p.position === pos);
    if (group.length) acc[pos] = group;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shrink-0"
            style={{ backgroundColor: team.primaryColor || '#477050' }}
          >
            {team.logo
              ? <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
              : team.shortName?.slice(0, 3)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900">{team.name}</h1>
            <p className="text-brand-muted mt-1">{team.city}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 justify-center sm:justify-start">
              {team.founded && <span>🏆 {t.teams.founded}: <span className="text-gray-900 font-medium">{team.founded}</span></span>}
              {team.stadium && <span>🏟️ <span className="text-gray-900 font-medium">{team.stadium}</span></span>}
              {team.capacity && <span>👥 <span className="text-gray-900 font-medium">{team.capacity.toLocaleString()}</span> {t.team.capacity}</span>}
            </div>
            {team.leagues?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {team.leagues.map((l) => (
                  <Link key={l._id} to={`/classifica/${l.slug}`}
                    className="bg-brand-primary/10 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                    {l.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.team.squad}</h2>
          {Object.keys(playersByPosition).length === 0 ? (
            <p className="text-brand-muted card p-6 text-center">{t.team.noPlayers}</p>
          ) : (
            <div className="space-y-6">
              {POSITION_ORDER.filter((p) => playersByPosition[p]).map((pos) => (
                <div key={pos}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${POSITION_COLORS[pos]}`}>{pos}</span>
                    <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">{POSITION_LABELS[pos]}</h3>
                  </div>
                  <div className="card divide-y divide-brand-border">
                    {playersByPosition[pos].map((p) => {
                      const st = p.stats || {};
                      return (
                        <Link
                          key={p._id}
                          to={`/giocatori/${p._id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="w-7 text-center text-brand-muted text-sm font-bold shrink-0">
                            {p.number || '—'}
                          </span>

                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ backgroundColor: team.primaryColor || '#477050' }}
                          >
                            {p.photo
                              ? <img src={p.photo} alt={`${p.firstName} ${p.lastName}`} className="w-9 h-9 rounded-full object-cover" />
                              : p.firstName?.[0]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{p.firstName} {p.lastName}</p>
                            <p className="text-xs text-brand-muted">{p.nationality}</p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <StatPill value={st.goals} icon="⚽" title={S.goals} colorClass="bg-green-100 text-green-700" />
                            <StatPill value={st.assists} icon="🅰" title={S.assists} colorClass="bg-blue-100 text-blue-700" />
                            <StatPill value={st.yellowCards} icon="🟨" title={S.yellowCards} colorClass="bg-yellow-100 text-yellow-700" />
                            <StatPill value={st.redCards} icon="🟥" title={S.redCards} colorClass="bg-red-100 text-red-700" />
                          </div>

                          <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.team.recentMatches}</h2>
          {recentMatches?.length === 0 ? (
            <p className="text-brand-muted card p-6 text-center">{t.team.noMatches}</p>
          ) : (
            <div className="space-y-2">
              {recentMatches?.map((m) => <MatchCard key={m._id} match={m} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
