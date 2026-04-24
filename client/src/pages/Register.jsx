import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import GoogleAuthButton from '../components/common/GoogleAuthButton.jsx';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'];

export default function Register() {
  const { user, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', position: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-secondary/10 rounded-2xl mb-4">
            <span className="text-2xl">⚽</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">{t.register.title}</h1>
          <p className="text-brand-muted mt-1">{t.register.subtitle}</p>
        </div>

        <div className="card p-8 space-y-5">
          <GoogleAuthButton onError={setError} />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-xs text-brand-muted">oppure</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.register.fieldName}</label>
              <input type="text" value={form.name} onChange={set('name')} className="input" placeholder="Mario Rossi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.register.fieldUsername}</label>
              <input type="text" value={form.username} onChange={set('username')} className="input" placeholder="mariorossi99" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.register.fieldEmail}</label>
              <input type="email" value={form.email} onChange={set('email')} className="input" placeholder="mario@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.register.fieldPassword}</label>
              <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.register.fieldPosition}</label>
              <select value={form.position} onChange={set('position')} className="input">
                <option value="">{t.register.fieldPositionPlaceholder}</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{t.player.positions[p]}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? t.common.loading : t.register.submit}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted">
            {t.register.haveAccount}{' '}
            <Link to="/login" className="text-brand-secondary font-medium hover:underline">{t.register.loginLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
