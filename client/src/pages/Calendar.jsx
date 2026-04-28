import { useState } from 'react';
import { format } from 'date-fns';
import { it, enUS, hu } from 'date-fns/locale';
import { useApi } from '../hooks/useApi.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const DATE_LOCALES = { it, en: enUS, hu };

export default function Calendar() {
  const { t, lang } = useLanguage();
  const [league, setLeague] = useState('');
  const [matchday, setMatchday] = useState('');
  const dateLocale = DATE_LOCALES[lang] || it;

  const { data: leagues } = useApi('/leagues');
  const { data: matches, loading, error } = useApi('/matches', {
    ...(league && { league }),
    ...(matchday && { matchday }),
    limit: 100,
  });

  const grouped = (matches || []).reduce((acc, m) => {
    const key = format(new Date(m.date), 'EEEE d MMMM yyyy', { locale: dateLocale });
    (acc[key] = acc[key] || []).push(m);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">
        <span style={{ color: '#477050' }}>{t.calendar.title.split(' ')[0]}</span>{' '}
        <span style={{ color: '#CE2939' }}>{t.calendar.title.split(' ').slice(1).join(' ')}</span>
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={league} onChange={(e) => setLeague(e.target.value)} className="input max-w-xs">
          <option value="">{t.calendar.allLeagues}</option>
          {leagues?.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
        <select value={matchday} onChange={(e) => setMatchday(e.target.value)} className="input max-w-[160px]">
          <option value="">Tutte le giornate</option>
          {Array.from({ length: 34 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>Giornata {g}</option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        Object.keys(grouped).length === 0 ? (
          <p className="text-brand-muted text-center py-16 card">{t.calendar.noMatches}</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, ms]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-2 capitalize">{date}</h2>
                <div className="space-y-2">
                  {ms.map((m) => <MatchCard key={m._id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
