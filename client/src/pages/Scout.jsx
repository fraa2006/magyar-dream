import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import VideoCard from '../components/scout/VideoCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'];

export default function Scout() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [position, setPosition] = useState('');

  const params = position ? { position } : {};
  const { data: videos, loading, error } = useApi('/videos', params);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-brand-secondary to-green-800 text-white px-8 py-12 text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTZzLTItNC0yLTYtMiA0LTIgNiAyIDQgMiA2eiIvPjwvZz48L2c+PC9zdmc+')]" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Magyar Dream Talent Scout
          </div>
          <h1 className="text-4xl font-extrabold mb-3">{t.scout.heroTitle}</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-6">{t.scout.heroSubtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {!user && (
              <>
                <Link to="/register" className="bg-white text-brand-secondary font-semibold px-6 py-2.5 rounded-lg hover:bg-white/90 transition-colors">
                  {t.scout.ctaRegister}
                </Link>
                <Link to="/premium" className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-primary/90 transition-colors">
                  {t.scout.ctaUpgrade}
                </Link>
              </>
            )}
            {user && !user.isPremium && (
              <Link to="/premium" className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-primary/90 transition-colors">
                {t.scout.ctaUpgrade}
              </Link>
            )}
            {user?.isPremium && (
              <Link to="/dashboard" className="bg-white text-brand-secondary font-semibold px-6 py-2.5 rounded-lg hover:bg-white/90 transition-colors">
                {t.nav.dashboard}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Video caricati', value: videos?.length ?? '—' },
          { label: 'Giocatori premium', value: videos ? new Set(videos.map((v) => v.user?._id)).size : '—' },
          { label: 'Scout attivi', value: '12+' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-xs text-brand-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setPosition('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            position === '' ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-secondary hover:text-brand-secondary'
          }`}
        >
          {t.scout.filterAll}
        </button>
        {POSITIONS.map((p) => (
          <button
            key={p}
            onClick={() => setPosition(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              position === p ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-secondary hover:text-brand-secondary'
            }`}
          >
            {t.player.positions[p]}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        videos?.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-brand-muted">{t.scout.noVideos}</p>
            {!user && (
              <Link to="/register" className="btn-primary mt-4 inline-block px-6 py-2">{t.scout.ctaRegister}</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => (
              <VideoCard key={v._id} video={v} showDelete={false} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
