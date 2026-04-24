import { useParams, Link } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const POSITION_COLORS = {
  GK: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  DF: 'bg-blue-100 text-blue-700 border-blue-200',
  MF: 'bg-green-100 text-green-700 border-green-200',
  FW: 'bg-red-100 text-red-700 border-red-200',
};

function StatCard({ icon, value, label, highlight }) {
  return (
    <div className={`card p-4 text-center ${highlight ? 'border-2 border-brand-secondary' : ''}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-extrabold text-gray-900">{value ?? '—'}</div>
      <div className="text-xs text-brand-muted mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function PlayerDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { data: player, loading, error } = useApi(`/players/${id}`);
  const { data: stats, loading: statsLoading } = useApi(`/players/${id}/stats`);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!player) return null;

  const age = player.dateOfBirth ? differenceInYears(new Date(), new Date(player.dateOfBirth)) : null;
  const positionLabel = t.player.positions[player.position] || player.position;
  const posColor = POSITION_COLORS[player.position] || 'bg-gray-100 text-gray-700 border-gray-200';
  const S = t.player.stats;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      {player.team && (
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-4">
          <Link to="/squadre" className="hover:text-gray-900">{t.nav.teams}</Link>
          <span>›</span>
          <Link to={`/squadre/${player.team._id}`} className="hover:text-gray-900">{player.team.name}</Link>
          <span>›</span>
          <span className="text-gray-900">{player.firstName} {player.lastName}</span>
        </div>
      )}

      {/* Header card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shrink-0"
            style={{ backgroundColor: player.team?.primaryColor || '#477050' }}
          >
            {player.photo
              ? <img src={player.photo} alt={`${player.firstName} ${player.lastName}`} className="w-24 h-24 rounded-full object-cover" />
              : player.firstName?.[0]}
          </div>
          <div className="text-center sm:text-left flex-1">
            {player.number && (
              <span className="text-5xl font-extrabold text-brand-primary/20 block leading-none">#{player.number}</span>
            )}
            <h1 className="text-3xl font-extrabold text-gray-900">{player.firstName} {player.lastName}</h1>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${posColor}`}>
                {positionLabel}
              </span>
              {player.nationality && (
                <span className="text-sm text-brand-muted">{player.nationality}</span>
              )}
            </div>
            {player.team && (
              <Link
                to={`/squadre/${player.team._id}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                🏟️ <span className="font-medium">{player.team.name}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t.player.nationality, value: player.nationality || '—' },
          { label: t.player.age, value: age ? `${age} ${t.player.years}` : '—' },
          { label: t.player.birthdate, value: player.dateOfBirth ? format(new Date(player.dateOfBirth), 'dd/MM/yyyy') : '—' },
          { label: t.player.position, value: positionLabel || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-brand-muted text-xs uppercase tracking-wider">{label}</p>
            <p className="text-gray-900 font-semibold mt-1 text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Season stats */}
      <div className="mb-2">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Statistiche stagione</h2>
        {statsLoading ? (
          <div className="grid grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse h-24 bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard icon="⚽" value={stats?.goals ?? 0} label={S.goals} highlight={stats?.goals > 0} />
            <StatCard icon="🅰️" value={stats?.assists ?? 0} label={S.assists} />
            <StatCard icon="🟨" value={stats?.yellowCards ?? 0} label={S.yellowCards} />
            <StatCard icon="🟥" value={stats?.redCards ?? 0} label={S.redCards} />
            <StatCard icon="📋" value={stats?.matchesPlayed ?? 0} label={S.matches} />
          </div>
        )}
      </div>
    </div>
  );
}
