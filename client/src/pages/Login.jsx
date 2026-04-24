import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import GoogleAuthButton from '../components/common/GoogleAuthButton.jsx';

export default function Login() {
  const { user, login, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user: loggedIn } = await login(form.email, form.password);
      navigate(loggedIn.role === 'admin' || loggedIn.role === 'superadmin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenziali non valide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{t.nav.login}</h1>
          <p className="text-brand-muted mt-2">Magyar Dream</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? t.common.loading : t.nav.login}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted">
            {t.register.haveAccount}{' '}
            <Link to="/register" className="text-brand-secondary font-medium hover:underline">
              {t.register.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
