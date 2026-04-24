import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { format } from 'date-fns';
import api from '../services/api.js';

const CHECK = (
  <svg className="w-5 h-5 text-brand-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Premium() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const features = [
    t.premium.feature1,
    t.premium.feature2,
    t.premium.feature3,
    t.premium.feature4,
    t.premium.feature5,
  ];

  const handleUpgrade = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/subscription/upgrade');
      await refreshUser();
      setModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
          <span>★</span> Premium
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{t.premium.title}</h1>
        <p className="text-brand-muted text-lg">{t.premium.subtitle}</p>
      </div>

      {user?.isPremium && (
        <div className="card p-8 text-center mb-6">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t.premium.alreadyPremium}</h2>
          {user.premiumSince && (
            <p className="text-brand-muted text-sm">
              {t.premium.activeSince}: {format(new Date(user.premiumSince), 'dd/MM/yyyy')}
            </p>
          )}
          <Link to="/dashboard" className="btn-primary inline-block mt-5 px-8 py-2.5">
            {t.nav.dashboard}
          </Link>
        </div>
      )}

      {!user?.isPremium && (
        <div className="card border-2 border-brand-secondary p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-brand-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
            PREMIUM
          </div>

          <div className="mb-6">
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold text-gray-900">€{t.premium.price}</span>
              <span className="text-brand-muted mb-1.5">{t.premium.period}</span>
            </div>
            <p className="text-xs text-brand-muted mt-1">{t.premium.cancelAnytime}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                {CHECK}
                {f}
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="space-y-3">
              <Link to="/register" className="btn-primary w-full py-3 text-center block">
                {t.scout.ctaRegister}
              </Link>
              <p className="text-center text-sm text-brand-muted">
                {t.register.haveAccount}{' '}
                <Link to="/login" className="text-brand-secondary font-medium hover:underline">{t.nav.login}</Link>
              </p>
            </div>
          ) : (
            <button onClick={() => setModal(true)} className="btn-primary w-full py-3">
              {t.premium.cta}
            </button>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="text-3xl mb-3">⚽</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{t.premium.modalTitle}</h2>
            <p className="text-sm text-brand-muted mb-6">{t.premium.modalDesc}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-4">{error}</div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 py-2.5">{t.premium.modalCancel}</button>
              <button onClick={handleUpgrade} disabled={loading} className="btn-primary flex-1 py-2.5">
                {loading ? t.common.loading : t.premium.modalConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
