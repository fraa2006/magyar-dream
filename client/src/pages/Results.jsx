import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function Results() {
  const { t } = useLanguage();
  const [league, setLeague] = useState('');
  const [matchday, setMatchday] = useState('');

  const { data: leagues } = useApi('/leagues');
  const { data: matches, loading, error } = useApi('/matches', {
    status: 'finished',
    ...(league && { league }),
    ...(matchday && { matchday }),
    limit: 50,
  });

  const grouped = (matches || []).reduce((acc, m) => {
    const key = `${m.league?.shortName} - ${t.results.matchday} ${m.matchday}`;
    (acc[key] = acc[key] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">
        <span style={{ color: '#477050' }}>{t.results.title.split(' ')[0]}</span>{' '}
        <span style={{ color: '#CE2939' }}>{t.results.title.split(' ').slice(1).join(' ')}</span>
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={league} onChange={(e) => setLeague(e.target.value)} className="input max-w-xs">
          <option value="">{t.results.allLeagues}</option>
          {leagues?.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
        <input
          type="number"
          placeholder={t.results.matchday}
          value={matchday}
          onChange={(e) => setMatchday(e.target.value)}
          min={1}
          className="input w-32"
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        Object.keys(grouped).length === 0 ? (
          <p className="text-brand-muted text-center py-16 card">{t.results.noResults}</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([group, ms]) => (
              <div key={group}>
                <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-2">{group}</h2>
                <div className="space-y-2">
                  {ms.map((m) => <MatchCard key={m._id} match={m} showLeague={false} />)}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
