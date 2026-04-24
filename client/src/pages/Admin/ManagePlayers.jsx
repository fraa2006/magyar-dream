import { useState } from 'react';
import { useApi } from '../../hooks/useApi.js';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const POSITION_LABELS = {
  GK: 'Portiere',
  DF: 'Difensore',
  MF: 'Centrocampista',
  FW: 'Attaccante',
};

const DEFAULT_FORM = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: 'HU',
  position: 'FW',
  number: '',
  photo: '',
  team: '',
};

export default function ManagePlayers() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [filterTeam, setFilterTeam] = useState('');

  const { data: teams } = useApi('/teams');
  const { data: players, loading, refetch } = useApi('/players', {
    ...(filterTeam && { team: filterTeam }),
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      if (editId) {
        await api.put(`/players/${editId}`, form);
        setMsg({ type: 'success', text: 'Giocatore aggiornato!' });
      } else {
        await api.post('/players', form);
        setMsg({ type: 'success', text: 'Giocatore aggiunto alla rosa!' });
      }
      setForm(DEFAULT_FORM);
      setEditId(null);
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore nel salvataggio' });
    }

    setSaving(false);
  };

  function handleEdit(player) {
    setEditId(player._id);
    setForm({
      firstName: player.firstName,
      lastName: player.lastName,
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.split('T')[0] : '',
      nationality: player.nationality || 'HU',
      position: player.position,
      number: player.number || '',
      photo: player.photo || '',
      team: player.team?._id || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!confirm('Eliminare questo giocatore?')) return;
    await api.delete(`/players/${id}`);
    refetch();
  }

  function handleCancel() {
    setEditId(null);
    setForm(DEFAULT_FORM);
    setMsg(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">
        {editId ? (
          <><span style={{ color: '#477050' }}>Modifica</span> <span style={{ color: '#CE2939' }}>Giocatore</span></>
        ) : (
          <><span style={{ color: '#477050' }}>Nuovo</span> <span style={{ color: '#CE2939' }}>Giocatore</span></>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Cognome *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Data di nascita</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Nazionalità (codice ISO)</label>
            <input
              type="text"
              value={form.nationality}
              onChange={(e) => updateField('nationality', e.target.value)}
              placeholder="es. HU, IT, BR..."
              maxLength={5}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Ruolo *</label>
            <select
              value={form.position}
              onChange={(e) => updateField('position', e.target.value)}
              className="input"
              required
            >
              <option value="GK">Portiere (GK)</option>
              <option value="DF">Difensore (DF)</option>
              <option value="MF">Centrocampista (MF)</option>
              <option value="FW">Attaccante (FW)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Numero di maglia</label>
            <input
              type="number"
              value={form.number}
              onChange={(e) => updateField('number', e.target.value)}
              min={1}
              max={99}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Squadra attuale</label>
            <select
              value={form.team}
              onChange={(e) => updateField('team', e.target.value)}
              className="input"
            >
              <option value="">Nessuna squadra</option>
              {teams?.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">URL Foto</label>
            <input
              type="url"
              value={form.photo}
              onChange={(e) => updateField('photo', e.target.value)}
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

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Salvataggio...' : editId ? 'Salva modifiche' : 'Aggiungi giocatore'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Annulla
            </button>
          )}
        </div>
      </form>

      {/* Lista giocatori con filtro per squadra */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-extrabold">
          <span style={{ color: '#477050' }}>Giocatori</span> <span style={{ color: '#CE2939' }}>nel sistema</span>
        </h2>
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">Tutte le squadre</option>
          {teams?.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card divide-y divide-brand-border">
          {players?.length === 0 && (
            <p className="text-center text-brand-muted py-8">Nessun giocatore trovato</p>
          )}
          {players?.map((p) => (
            <div key={p._id} className="flex items-center gap-4 px-4 py-3">
              <span className="w-8 text-center text-brand-muted text-sm font-bold shrink-0">
                {p.number || '—'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-xs text-brand-muted">
                  {p.team?.name || 'Senza squadra'} · {POSITION_LABELS[p.position]} · {p.nationality}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-xs btn-secondary py-1 px-3"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-xs bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white rounded-lg py-1 px-3 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
