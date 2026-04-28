import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const LEAGUES = [
  { slug: 'nb1', name: 'NB I' },
  { slug: 'nb2', name: 'NB II' },
];

function Medal({ position }) {
  if (position === 1) return <span className="text-xl">🥇</span>;
  if (position === 2) return <span className="text-xl">🥈</span>;
  if (position === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-brand-muted font-semibold text-sm w-6 text-center">{position}</span>;
}

export default function TopScorers() {
  const { leagueSlug = 'nb1' } = useParams();
  const { t } = useLanguage();
  const { data, loading, error } = useApi(`/standings/${leagueSlug}/scorers`);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">
          <span style={{ color: '#477050' }}>{t.scorers.title.split(' ')[0]}</span>{' '}
          <span style={{ color: '#CE2939' }}>{t.scorers.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-brand-muted">{data?.league?.name} · {data?.season?.name}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {LEAGUES.map(({ slug, name }) => (
          <Link
            key={slug}
            to={`/marcatori/${slug}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              leagueSlug === slug
                ? 'bg-brand-primary text-white'
                : 'bg-white border border-brand-border text-gray-600 hover:text-gray-900 hover:border-brand-primary'
            }`}
          >
            {name}
          </Link>
        ))}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        data?.scorers?.length === 0 ? (
          <div className="card py-12 text-center text-brand-muted">
            {t.scorers.noGoals}
          </div>
        ) : (
          <div className="card divide-y divide-brand-border">
            {data?.scorers?.map((row, i) => (
              <div key={row.player?._id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 flex items-center justify-center shrink-0">
                  <Medal position={i + 1} />
                </div>

                <Link
                  to={`/giocatori/${row.player?._id}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: row.player?.team?.primaryColor || '#333' }}
                >
                  {row.player?.photo
                    ? <img src={row.player.photo} alt={`${row.player.firstName} ${row.player.lastName}`} className="w-10 h-10 rounded-full object-cover" />
                    : row.player?.firstName?.[0]
                  }
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/giocatori/${row.player?._id}`}
                    className="font-semibold text-gray-900 hover:text-brand-primary transition-colors"
                  >
                    {row.player?.firstName} {row.player?.lastName}
                  </Link>
                  {row.player?.team && (
                    <Link
                      to={`/squadre/${row.player.team._id}`}
                      className="block text-xs text-brand-muted hover:text-gray-900 transition-colors truncate"
                    >
                      {row.player.team.name}
                    </Link>
                  )}
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="text-3xl font-extrabold text-brand-primary">{row.goals}</span>
                  <span className="text-xs text-brand-muted">{t.scorers.goals}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
