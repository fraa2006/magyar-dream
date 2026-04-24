import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'];

export default function UploadVideoModal({ onClose, onSubmit }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', position: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">{t.dashboard.modalTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.fieldTitle} *</label>
            <input type="text" value={form.title} onChange={set('title')} className="input" required maxLength={100} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.fieldDesc}</label>
            <textarea value={form.description} onChange={set('description')} className="input resize-none" rows={2} maxLength={500} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.fieldUrl} *</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={set('videoUrl')}
              className="input"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            <p className="text-xs text-brand-muted mt-1">Incolla il link di YouTube del tuo video</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.dashboard.fieldPosition}</label>
            <select value={form.position} onChange={set('position')} className="input">
              <option value="">{t.dashboard.fieldPositionPlaceholder}</option>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>{t.player.positions[p]}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">{t.dashboard.cancel}</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
              {loading ? t.common.loading : t.dashboard.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
