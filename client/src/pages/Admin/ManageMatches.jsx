import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.js';
import api from '../../services/api.js';
import { format } from 'date-fns';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const EMPTY = { homeTeam: '', awayTeam: '', league: '', season: '', matchday: 1, date: '', venue: '', status: 'scheduled', homeScore: '', awayScore: '' };

export default function ManageMatches() {
  const [form, setForm] = useState(EMPTY);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editId, setEditId] = useState(null);

  const { data: leagues } = useApi('/leagues');
  const { data: seasons } = useApi(selectedLeague ? `/leagues/${selectedLeague}/seasons` : null);
  const { data: teams } = useApi('/teams');
  const { data: matches, loading, refetch } = useApi('/matches', { ...(selectedLeague && { league: selectedLeague }), limit: 100 });

  const handleLeagueChange = (e) => {
    const val = e.target.value;
    setSelectedLeague(val);
    setForm((f) => ({ ...f, league: val, season: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg(null);
    try {
      const body = { ...form, homeScore: form.homeScore === '' ? null : Number(form.homeScore), awayScore: form.awayScore === '' ? null : Number(form.awayScore) };
      if (editId) await api.put(`/matches/${editId}`, body);
      else await api.post('/matches', body);
      setMsg({ type: 'success', text: editId ? 'Partita aggiornata!' : 'Partita creata!' });
      setForm(EMPTY); setEditId(null);
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore' });
    } finally { setSaving(false); }
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setSelectedLeague(m.league?._id || '');
    setForm({ homeTeam: m.homeTeam?._id || '', awayTeam: m.awayTeam?._id || '', league: m.league?._id || '', season: m.season?._id || '', matchday: m.matchday, date: m.date ? format(new Date(m.date), "yyyy-MM-dd'T'HH:mm") : '', venue: m.venue || '', status: m.status, homeScore: m.homeScore ?? '', awayScore: m.awayScore ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare questa partita?')) return;
    await api.delete(`/matches/${id}`);
    refetch();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">
        {editId ? (
          <><span style={{ color: '#477050' }}>Modifica</span> <span style={{ color: '#CE2939' }}>Partita</span></>
        ) : (
          <><span style={{ color: '#477050' }}>Aggiungi</span> <span style={{ color: '#CE2939' }}>Partita</span></>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lega</label>
            <select value={selectedLeague} onChange={handleLeagueChange} className="input" required>
              <option value="">Seleziona lega</option>
              {leagues?.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stagione</label>
            <select value={form.season} onChange={set('season')} className="input" required>
              <option value="">Seleziona stagione</option>
              {seasons?.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Squadra Casa</label>
            <select value={form.homeTeam} onChange={set('homeTeam')} className="input" required>
              <option value="">Seleziona squadra</option>
              {teams?.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Squadra Ospite</label>
            <select value={form.awayTeam} onChange={set('awayTeam')} className="input" required>
              <option value="">Seleziona squadra</option>
              {teams?.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Data e ora</label>
            <input type="datetime-local" value={form.date} onChange={set('date')} className="input" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Giornata</label>
            <input type="number" value={form.matchday} onChange={set('matchday')} className="input" min={1} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stato</label>
            <select value={form.status} onChange={set('status')} className="input">
              <option value="scheduled">Programmata</option>
              <option value="live">In corso</option>
              <option value="finished">Finita</option>
              <option value="postponed">Rinviata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Stadio</label>
            <input type="text" value={form.venue} onChange={set('venue')} className="input" placeholder="Es. Groupama Aréna" />
          </div>
          {(form.status === 'finished' || form.status === 'live') && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gol Casa</label>
                <input type="number" value={form.homeScore} onChange={set('homeScore')} className="input" min={0} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gol Ospite</label>
                <input type="number" value={form.awayScore} onChange={set('awayScore')} className="input" min={0} />
              </div>
            </>
          )}
        </div>

        {msg && (
          <div className={`rounded-lg px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{msg.text}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Salvataggio...' : editId ? 'Aggiorna' : 'Aggiungi Partita'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} className="btn-secondary">Annulla</button>}
        </div>
      </form>

      <h2 className="text-xl font-extrabold mb-4">
        <span style={{ color: '#477050' }}>Partite</span> <span style={{ color: '#CE2939' }}>registrate</span>
      </h2>
      <div className="mb-3">
        <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="input max-w-xs">
          <option value="">Tutte le leghe</option>
          {leagues?.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="card divide-y divide-brand-border">
          {matches?.length === 0 && <p className="text-center text-brand-muted py-8">Nessuna partita</p>}
          {matches?.map((m) => (
            <div key={m._id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{m.homeTeam?.shortName} vs {m.awayTeam?.shortName}</p>
                <p className="text-xs text-brand-muted">{m.league?.shortName} · G{m.matchday} · {m.date ? format(new Date(m.date), 'dd/MM/yyyy HH:mm') : '—'}</p>
              </div>
              <div className="shrink-0 text-center">
                {m.status === 'finished' ? (
                  <span className="font-bold text-white">{m.homeScore} – {m.awayScore}</span>
                ) : (
                  <span className="text-xs text-brand-muted capitalize">{m.status}</span>
                )}
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button onClick={() => handleEdit(m)} className="text-xs btn-secondary py-1 px-2">Modifica</button>
                <Link to={`/admin/partite/${m._id}/eventi`} className="text-xs bg-brand-gold/10 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-black rounded-lg py-1 px-2 transition-colors font-semibold">
                  ⚽ Tabellino
                </Link>
                <button onClick={() => handleDelete(m._id)} className="text-xs bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white rounded-lg py-1 px-2 transition-colors">Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
