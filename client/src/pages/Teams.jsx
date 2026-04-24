import { useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import TeamCard from '../components/teams/TeamCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function Teams() {
  const { t } = useLanguage();
  const [league, setLeague] = useState('');
  const [search, setSearch] = useState('');

  const { data: leagues } = useApi('/leagues');
  const { data: teams, loading, error } = useApi('/teams', { ...(league && { league }) });

  const filtered = (teams || []).filter((team) =>
    !search || team.name.toLowerCase().includes(search.toLowerCase()) || team.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">
        <span style={{ color: '#477050' }}>{t.teams.title.split(' ')[0]}</span>{' '}
        <span style={{ color: '#CE2939' }}>{t.teams.title.split(' ').slice(1).join(' ')}</span>
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder={t.teams.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 max-w-sm"
        />
        <select value={league} onChange={(e) => setLeague(e.target.value)} className="input max-w-xs">
          <option value="">{t.teams.allLeagues}</option>
          {leagues?.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        filtered.length === 0 ? (
          <p className="text-brand-muted text-center py-16 card">{t.teams.noTeams}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((team) => <TeamCard key={team._id} team={team} />)}
          </div>
        )
      )}
    </div>
  );
}
