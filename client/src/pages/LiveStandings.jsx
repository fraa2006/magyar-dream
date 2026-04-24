import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const LEAGUES = [
  { key: 'nb1', name: 'NB I', desc: 'Nemzeti Bajnokság I' },
  { key: 'nb2', name: 'NB II', desc: 'Nemzeti Bajnokság II' },
  { key: 'u19', name: 'U19', desc: 'U19 Liga' },
];

function StandingsRow({ row, index }) {
  const isTop = index < 2;
  const isEurope = index >= 2 && index < 5;
  const isRelegation = index >= row.total - 3;

  let rowAccent = '';
  if (isTop) rowAccent = 'border-l-2 border-l-green-500';
  else if (isEurope) rowAccent = 'border-l-2 border-l-blue-400';

  return (
    <tr className={`border-b border-brand-border hover:bg-gray-50/5 transition-colors ${rowAccent}`}>
      <td className="py-2.5 pl-4 pr-2 text-center w-8">
        <span className={`text-sm font-bold ${isTop ? 'text-green-400' : isEurope ? 'text-blue-400' : 'text-brand-muted'}`}>
          {row.rank}
        </span>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2.5">
          {row.team?.logo && (
            <img src={row.team.logo} alt={row.team.name} className="w-6 h-6 object-contain" />
          )}
          <span className="text-sm font-semibold text-gray-900 truncate max-w-36">{row.team?.name}</span>
        </div>
      </td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted">{row.all?.played}</td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted hidden sm:table-cell">{row.all?.win}</td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted hidden sm:table-cell">{row.all?.draw}</td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted hidden sm:table-cell">{row.all?.lose}</td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted hidden md:table-cell">
        {row.all?.goals?.for}:{row.all?.goals?.against}
      </td>
      <td className="py-2.5 px-2 text-center text-sm text-brand-muted hidden sm:table-cell">{row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}</td>
      <td className="py-2.5 pl-2 pr-4 text-center">
        <span className="text-sm font-extrabold text-gray-900">{row.points}</span>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mt-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}

export default function LiveStandings() {
  const [active, setActive] = useState('nb1');
  const { data, loading, error } = useApi(`/live/${active}`);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1">
          <span style={{ color: '#477050' }}>Classifiche</span>{' '}
          <span style={{ color: '#CE2939' }}>Live</span>
        </h1>
        <p className="text-brand-muted text-sm">Dati ufficiali aggiornati in tempo reale · Stagione 2024/25</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {LEAGUES.map(({ key, name, desc }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              active === key
                ? 'text-white shadow-sm'
                : 'bg-white border border-brand-border text-gray-600 hover:border-brand-primary hover:text-gray-900'
            }`}
            style={active === key ? { backgroundColor: '#477050' } : {}}
          >
            {name}
            <span className={`ml-1.5 text-xs font-normal hidden sm:inline ${active === key ? 'text-white/80' : 'text-brand-muted'}`}>
              {desc}
            </span>
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading && <div className="p-6"><TableSkeleton /></div>}

        {error && (
          <div className="p-8 text-center">
            <p className="text-brand-muted text-sm">Impossibile caricare i dati. Riprova tra poco.</p>
          </div>
        )}

        {!loading && !error && data?.standings?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-brand-muted text-sm">Nessun dato disponibile per questa lega.</p>
          </div>
        )}

        {!loading && !error && data?.standings?.length > 0 && (
          <>
            <div className="px-4 py-3 border-b border-brand-border bg-gray-50/50 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">{data.league?.name}</span>
              <div className="flex items-center gap-4 text-xs text-brand-muted">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Promozione</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Europa</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border">
                    <th className="py-2 pl-4 pr-2 text-center text-xs font-semibold text-brand-muted w-8">#</th>
                    <th className="py-2 px-2 text-left text-xs font-semibold text-brand-muted">Squadra</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted">G</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted hidden sm:table-cell">V</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted hidden sm:table-cell">N</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted hidden sm:table-cell">P</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted hidden md:table-cell">GF:GS</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-brand-muted hidden sm:table-cell">DR</th>
                    <th className="py-2 pl-2 pr-4 text-center text-xs font-semibold text-brand-muted">Pt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.standings.map((row, i) => (
                    <StandingsRow key={row.team?.id} row={{ ...row, total: data.standings.length }} index={i} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-2.5 border-t border-brand-border text-xs text-brand-muted flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dati forniti da API-Football · aggiornati ogni ora
            </div>
          </>
        )}
      </div>
    </div>
  );
}
