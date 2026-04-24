import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useApi } from '../../hooks/useApi.js';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const EVENT_TYPES = [
  { value: 'goal', label: '⚽ Gol' },
  { value: 'yellow_card', label: '🟨 Cartellino giallo' },
  { value: 'red_card', label: '🟥 Cartellino rosso' },
  { value: 'substitution', label: '🔄 Sostituzione' },
];

const EVENT_ICONS = { goal: '⚽', yellow_card: '🟨', red_card: '🟥', substitution: '🔄' };
const TYPE_LABELS = { goal: 'Gol', yellow_card: 'Cartellino giallo', red_card: 'Cartellino rosso', substitution: 'Sostituzione' };

const EMPTY_EVENT = { type: 'goal', minute: '', team: '', player: '', player2: '' };

export default function ManageMatchEvents() {
  const { id } = useParams();
  const [newEvent, setNewEvent] = useState(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const { data: match, loading, error, refetch } = useApi(`/matches/${id}`);
  const { data: homePlayers } = useApi(match?.homeTeam ? '/players' : null, { team: match?.homeTeam?._id });
  const { data: awayPlayers } = useApi(match?.awayTeam ? '/players' : null, { team: match?.awayTeam?._id });

  if (loading) return <LoadingSpinner />;
  if (error || !match) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <p className="text-red-400">Partita non trovata.</p>
      <Link to="/admin/partite" className="text-brand-primary hover:underline mt-2 block">← Torna alle partite</Link>
    </div>
  );

  const selectedTeamPlayers =
    newEvent.team === match.homeTeam?._id ? (homePlayers || []) :
    newEvent.team === match.awayTeam?._id ? (awayPlayers || []) : [];

  const set = (k) => (e) => setNewEvent((prev) => ({ ...prev, [k]: e.target.value }));

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.minute || !newEvent.team || !newEvent.type) {
      setMsg({ type: 'error', text: 'Compila minuto, squadra e tipo evento.' });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const toAdd = {
        type: newEvent.type,
        minute: Number(newEvent.minute),
        team: newEvent.team,
        ...(newEvent.player && { player: newEvent.player }),
        ...(newEvent.player2 && newEvent.type === 'substitution' && { player2: newEvent.player2 }),
      };
      const updatedEvents = [...(match.events || []), toAdd];
      await api.put(`/matches/${id}`, { events: updatedEvents });
      setMsg({ type: 'success', text: 'Evento aggiunto!' });
      setNewEvent(EMPTY_EVENT);
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore' });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEvent = async (index) => {
    if (!confirm('Rimuovere questo evento?')) return;
    const updatedEvents = match.events.filter((_, i) => i !== index);
    await api.put(`/matches/${id}`, { events: updatedEvents });
    refetch();
  };

  const sortedEvents = [...(match.events || [])].sort((a, b) => a.minute - b.minute);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/partite" className="text-brand-muted hover:text-white transition-colors text-sm">← Partite</Link>
        <span className="text-brand-border">/</span>
        <span className="text-white font-semibold">Gestione eventi</span>
      </div>

      {/* Match header */}
      <div className="card p-5 mb-6">
        <p className="text-xs text-brand-muted text-center mb-3">{match.league?.name} · Giornata {match.matchday} · {match.season?.name}</p>
        <div className="grid grid-cols-3 items-center gap-4 text-center">
          <div>
            <p className="font-bold text-white text-lg">{match.homeTeam?.shortName}</p>
            <p className="text-xs text-brand-muted">{match.homeTeam?.city}</p>
          </div>
          <div>
            {match.status === 'finished' || match.status === 'live' ? (
              <span className="text-4xl font-extrabold text-white tabular-nums">
                {match.homeScore} – {match.awayScore}
              </span>
            ) : (
              <span className="text-2xl font-bold text-brand-gold">
                {match.date ? format(new Date(match.date), 'HH:mm') : '—'}
              </span>
            )}
            <p className="text-xs text-brand-muted mt-1 capitalize">{match.status}</p>
          </div>
          <div>
            <p className="font-bold text-white text-lg">{match.awayTeam?.shortName}</p>
            <p className="text-xs text-brand-muted">{match.awayTeam?.city}</p>
          </div>
        </div>
      </div>

      {/* Add event form */}
      <div className="card p-5 mb-6">
        <h2 className="text-lg font-extrabold mb-4">
          <span style={{ color: '#477050' }}>Aggiungi</span> <span style={{ color: '#CE2939' }}>evento</span>
        </h2>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tipo *</label>
              <select value={newEvent.type} onChange={set('type')} className="input text-sm">
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Minuto *</label>
              <input type="number" value={newEvent.minute} onChange={set('minute')} className="input text-sm" placeholder="es. 23" min={1} max={120} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Squadra *</label>
              <select value={newEvent.team} onChange={(e) => { set('team')(e); setNewEvent((p) => ({ ...p, team: e.target.value, player: '', player2: '' })); }} className="input text-sm" required>
                <option value="">Seleziona squadra</option>
                <option value={match.homeTeam?._id}>{match.homeTeam?.name}</option>
                <option value={match.awayTeam?._id}>{match.awayTeam?.name}</option>
              </select>
            </div>
          </div>

          {newEvent.team && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  {newEvent.type === 'substitution' ? 'Esce' : 'Giocatore'}
                </label>
                <select value={newEvent.player} onChange={set('player')} className="input text-sm">
                  <option value="">Nessun giocatore</option>
                  {selectedTeamPlayers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.number ? `#${p.number} ` : ''}{p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {newEvent.type === 'substitution' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Entra</label>
                  <select value={newEvent.player2} onChange={set('player2')} className="input text-sm">
                    <option value="">Nessun giocatore</option>
                    {selectedTeamPlayers.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.number ? `#${p.number} ` : ''}{p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {msg && (
            <div className={`rounded-lg px-4 py-2 text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Aggiunta...' : 'Aggiungi evento'}
          </button>
        </form>
      </div>

      {/* Events list */}
      <div className="card">
        <div className="px-5 py-4 border-b border-brand-border">
          <h2 className="text-lg font-extrabold">
            <span style={{ color: '#477050' }}>Tabellino</span> <span style={{ color: '#CE2939' }}>({sortedEvents.length} eventi)</span>
          </h2>
        </div>
        {sortedEvents.length === 0 ? (
          <p className="text-brand-muted text-sm text-center py-8">Nessun evento. Aggiungine uno dal form sopra.</p>
        ) : (
          <div className="divide-y divide-brand-border">
            {sortedEvents.map((ev, i) => {
              const isHome = ev.team?._id === match.homeTeam?._id || ev.team === match.homeTeam?._id;
              const originalIndex = match.events.indexOf(ev);
              return (
                <div key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className={`flex items-center gap-3 flex-1 ${!isHome ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xl">{EVENT_ICONS[ev.type]}</span>
                    <span className="text-xs font-bold text-brand-gold w-8 text-center shrink-0">{ev.minute}'</span>
                    <div className={`${isHome ? 'text-left' : 'text-right'} flex-1 min-w-0`}>
                      <p className="text-white text-sm font-medium truncate">
                        {ev.player ? `${ev.player.firstName} ${ev.player.lastName}` : '—'}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {TYPE_LABELS[ev.type]} · {isHome ? match.homeTeam?.shortName : match.awayTeam?.shortName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(originalIndex)}
                    className="text-xs text-red-400 hover:text-red-300 shrink-0 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Rimuovi
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
