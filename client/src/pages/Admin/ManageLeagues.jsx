import { useState } from 'react';
import { useApi } from '../../hooks/useApi.js';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function ManageLeagues() {
  const [leagueName, setLeagueName] = useState('');
  const [leagueShortName, setLeagueShortName] = useState('');
  const [leagueSlug, setLeagueSlug] = useState('');
  const [leagueTier, setLeagueTier] = useState(1);
  const [leagueLogo, setLeagueLogo] = useState('');

  const [seasonName, setSeasonName] = useState('');
  const [seasonLeague, setSeasonLeague] = useState('');
  const [seasonStart, setSeasonStart] = useState('');
  const [seasonEnd, setSeasonEnd] = useState('');
  const [seasonActive, setSeasonActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const { data: leagues, loading, refetch } = useApi('/leagues');

  const handleLeagueSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      await api.post('/leagues', {
        name: leagueName,
        shortName: leagueShortName,
        slug: leagueSlug,
        tier: Number(leagueTier),
        logo: leagueLogo,
      });
      setMsg({ type: 'success', text: 'Lega creata con successo!' });
      setLeagueName('');
      setLeagueShortName('');
      setLeagueSlug('');
      setLeagueTier(1);
      setLeagueLogo('');
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore durante la creazione' });
    }

    setSaving(false);
  };

  const handleSeasonSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      await api.post('/leagues/seasons', {
        name: seasonName,
        league: seasonLeague,
        startDate: seasonStart,
        endDate: seasonEnd,
        active: seasonActive,
      });
      setMsg({ type: 'success', text: 'Stagione creata!' });
      setSeasonName('');
      setSeasonLeague('');
      setSeasonStart('');
      setSeasonEnd('');
      setSeasonActive(true);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore' });
    }

    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

      <div>
        <h1 className="text-2xl font-extrabold mb-6">
          <span style={{ color: '#477050' }}>Nuova</span> <span style={{ color: '#CE2939' }}>Lega</span>
        </h1>
        <form onSubmit={handleLeagueSubmit} className="card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome completo</label>
              <input
                type="text"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                placeholder="es. Nemzeti Bajnokság I"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sigla</label>
              <input
                type="text"
                value={leagueShortName}
                onChange={(e) => setLeagueShortName(e.target.value)}
                placeholder="es. NB I"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug (per l'URL)</label>
              <input
                type="text"
                value={leagueSlug}
                onChange={(e) => setLeagueSlug(e.target.value)}
                placeholder="es. nb1"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Livello divisione</label>
              <input
                type="number"
                value={leagueTier}
                onChange={(e) => setLeagueTier(e.target.value)}
                min={1}
                className="input"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">URL Logo (opzionale)</label>
              <input
                type="url"
                value={leagueLogo}
                onChange={(e) => setLeagueLogo(e.target.value)}
                placeholder="https://..."
                className="input"
              />
            </div>
          </div>

          {msg && (
            <div className={`rounded-lg px-4 py-3 text-sm ${
              msg.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvataggio...' : 'Crea Lega'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold mb-6">
          <span style={{ color: '#477050' }}>Nuova</span> <span style={{ color: '#CE2939' }}>Stagione</span>
        </h2>
        <form onSubmit={handleSeasonSubmit} className="card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Lega</label>
              <select
                value={seasonLeague}
                onChange={(e) => setSeasonLeague(e.target.value)}
                className="input"
                required
              >
                <option value="">Seleziona una lega</option>
                {leagues?.map((l) => (
                  <option key={l._id} value={l._id}>{l.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nome stagione</label>
              <input
                type="text"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                placeholder="es. 2024-25"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data inizio</label>
              <input
                type="date"
                value={seasonStart}
                onChange={(e) => setSeasonStart(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data fine</label>
              <input
                type="date"
                value={seasonEnd}
                onChange={(e) => setSeasonEnd(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={seasonActive}
              onChange={(e) => setSeasonActive(e.target.checked)}
              className="w-4 h-4 accent-brand-primary"
            />
            <span className="text-sm text-gray-300">Stagione in corso (attiva)</span>
          </label>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvataggio...' : 'Crea Stagione'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-extrabold mb-4">
          <span style={{ color: '#477050' }}>Leghe</span> <span style={{ color: '#CE2939' }}>nel sistema</span>
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="card divide-y divide-brand-border">
            {leagues?.length === 0 && (
              <p className="text-center text-brand-muted py-8">Nessuna lega trovata</p>
            )}
            {leagues?.map((l) => (
              <div key={l._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-white font-medium">{l.name}</p>
                  <p className="text-xs text-brand-muted">
                    slug: /{l.slug} &nbsp;·&nbsp; Divisione {l.tier}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                  {l.shortName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
