import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useApi } from '../hooks/useApi.js';
import VideoCard from '../components/scout/VideoCard.jsx';
import UploadVideoModal from '../components/scout/UploadVideoModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import api from '../services/api.js';
import { format } from 'date-fns';

const POSITION_LABELS = { GK: 'Portiere', DF: 'Difensore', MF: 'Centrocampista', FW: 'Attaccante' };

export default function Dashboard() {
  const { user, refreshUser, isAdmin } = useAuth();
  const canUpload = user?.isPremium || isAdmin;
  const { t } = useLanguage();
  const [showUpload, setShowUpload] = useState(false);

  const { data: videos, loading, refetch } = useApi(user ? `/videos` : null);

  const myVideos = (videos || []).filter((v) => v.user?._id === user?.id || v.user === user?.id);

  const handleUpload = async (form) => {
    await api.post('/videos', form);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.dashboard.deleteConfirm)) return;
    await api.delete(`/videos/${id}`);
    refetch();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-secondary/10 flex items-center justify-center text-2xl shrink-0">
          ⚽
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{user.name || user.username}</h1>
            {user.isPremium && (
              <span className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                ★ Premium
              </span>
            )}
          </div>
          <p className="text-sm text-brand-muted">{user.email}</p>
          {user.position && (
            <p className="text-xs text-brand-muted mt-0.5">{POSITION_LABELS[user.position] || user.position}</p>
          )}
          {user.isPremium && user.premiumSince && (
            <p className="text-xs text-brand-secondary mt-1 font-medium">
              {t.premium.activeSince}: {format(new Date(user.premiumSince), 'dd/MM/yyyy')}
            </p>
          )}
        </div>
        <Link to="/scout" className="btn-secondary text-sm px-4 py-2 shrink-0">
          {t.nav.scout}
        </Link>
      </div>

      {!canUpload && (
        <div className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 border border-brand-secondary/20 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">Magyar Dream Premium</p>
            <p className="text-sm text-brand-muted">{t.dashboard.premiumRequired}</p>
          </div>
          <Link to="/premium" className="btn-primary shrink-0 px-5 py-2 text-sm">
            {t.scout.ctaUpgrade} — €4,99/mese
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{t.dashboard.myVideos}</h2>
        {canUpload && (
          <button onClick={() => setShowUpload(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.dashboard.uploadVideo}
          </button>
        )}
      </div>

      {loading && <LoadingSpinner />}
      {!loading && myVideos.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-brand-muted mb-4">{t.dashboard.noVideos}</p>
          {canUpload ? (
            <button onClick={() => setShowUpload(true)} className="btn-primary px-6 py-2">
              {t.dashboard.uploadFirst}
            </button>
          ) : (
            <Link to="/premium" className="btn-primary px-6 py-2 inline-block">
              {t.scout.ctaUpgrade}
            </Link>
          )}
        </div>
      )}
      {!loading && myVideos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {myVideos.map((v) => (
            <VideoCard key={v._id} video={v} showDelete onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadVideoModal onClose={() => setShowUpload(false)} onSubmit={handleUpload} />
      )}
    </div>
  );
}
