import { useState } from 'react';
import { useApi } from '../../hooks/useApi.js';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const DEFAULT_FORM = {
  name: '',
  shortName: '',
  city: '',
  founded: '',
  stadium: '',
  capacity: '',
  logo: '',
  primaryColor: '#CE2939',
  secondaryColor: '#FFFFFF',
  website: '',
  leagues: [],
};

export default function ManageTeams() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editId, setEditId] = useState(null);

  const { data: leagues } = useApi('/leagues');
  const { data: teams, loading, refetch } = useApi('/teams');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleLeague(id) {
    setForm((prev) => {
      const already = prev.leagues.includes(id);
      return {
        ...prev,
        leagues: already
          ? prev.leagues.filter((l) => l !== id)
          : [...prev.leagues, id],
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      if (editId) {
        await api.put(`/teams/${editId}`, form);
        setMsg({ type: 'success', text: 'Squadra aggiornata!' });
      } else {
        await api.post('/teams', form);
        setMsg({ type: 'success', text: 'Squadra aggiunta!' });
      }
      setForm(DEFAULT_FORM);
      setEditId(null);
      refetch();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Errore durante il salvataggio' });
    }

    setSaving(false);
  };

  function handleEdit(team) {
    setEditId(team._id);
    setForm({
      name: team.name,
      shortName: team.shortName,
      city: team.city,
      founded: team.founded || '',
      stadium: team.stadium || '',
      capacity: team.capacity || '',
      logo: team.logo || '',
      primaryColor: team.primaryColor || '#CE2939',
      secondaryColor: team.secondaryColor || '#FFFFFF',
      website: team.website || '',
      leagues: team.leagues?.map((l) => l._id || l) || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!confirm('Sei sicuro di voler eliminare questa squadra?')) return;
    await api.delete(`/teams/${id}`);
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
          <><span style={{ color: '#477050' }}>Modifica</span> <span style={{ color: '#CE2939' }}>Squadra</span></>
        ) : (
          <><span style={{ color: '#477050' }}>Nuova</span> <span style={{ color: '#CE2939' }}>Squadra</span></>
        )}
      </h1>

      <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome squadra *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Sigla *</label>
            <input
              type="text"
              value={form.shortName}
              onChange={(e) => updateField('shortName', e.target.value)}
              placeholder="es. FTC"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Città *</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Anno di fondazione</label>
            <input
              type="number"
              value={form.founded}
              onChange={(e) => updateField('founded', e.target.value)}
              placeholder="es. 1899"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Stadio</label>
            <input
              type="text"
              value={form.stadium}
              onChange={(e) => updateField('stadium', e.target.value)}
              placeholder="es. Groupama Aréna"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Capienza stadio</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => updateField('capacity', e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">URL Logo</label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => updateField('logo', e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Sito web</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Colore primario</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="h-10 w-14 rounded border border-brand-border bg-brand-dark cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="input flex-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Colore secondario</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={form.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="h-10 w-14 rounded border border-brand-border bg-brand-dark cursor-pointer"
              />
              <input
                type="text"
                value={form.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="input flex-1"
              />
            </div>
          </div>

        </div>

        {/* Campionati di appartenenza */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Campionati</label>
          <div className="flex flex-wrap gap-2">
            {leagues?.map((l) => (
              <button
                key={l._id}
                type="button"
                onClick={() => toggleLeague(l._id)}
                className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                  form.leagues.includes(l._id)
                    ? 'bg-brand-primary border-brand-primary text-white'
                    : 'border-brand-border text-gray-400 hover:border-brand-primary'
                }`}
              >
                {l.name}
              </button>
            ))}
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
            {saving ? 'Salvataggio...' : editId ? 'Salva modifiche' : 'Aggiungi squadra'}
          </button>
          {editId && (
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Annulla
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-extrabold mb-4">
        <span style={{ color: '#477050' }}>Squadre</span> <span style={{ color: '#CE2939' }}>nel sistema</span>
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card divide-y divide-brand-border">
          {teams?.length === 0 && (
            <p className="text-center text-brand-muted py-8">Nessuna squadra ancora</p>
          )}
          {teams?.map((t) => (
            <div key={t._id} className="flex items-center gap-4 px-4 py-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: t.primaryColor || '#333' }}
              >
                {t.shortName?.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{t.name}</p>
                <p className="text-xs text-brand-muted">
                  {t.city}
                  {t.founded ? ` · Fondata nel ${t.founded}` : ''}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-xs btn-secondary py-1 px-3"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
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
