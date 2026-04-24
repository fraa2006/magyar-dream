import { useState } from 'react';
import api from '../../services/api.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const POSITION_COLORS = {
  GK: 'bg-yellow-100 text-yellow-700',
  DF: 'bg-blue-100 text-blue-700',
  MF: 'bg-green-100 text-green-700',
  FW: 'bg-red-100 text-red-700',
};

export default function VideoCard({ video, onDelete, showDelete }) {
  const { t } = useLanguage();
  const [played, setPlayed] = useState(false);
  const pos = video.position || video.user?.position || '';

  const handlePlay = () => {
    if (!played) {
      setPlayed(true);
      api.post(`/videos/${video._id}/view`).catch(() => {});
    }
  };

  return (
    <div className="card overflow-hidden group">
      <div className="relative aspect-video bg-gray-900">
        {played ? (
          <iframe
            src={`${video.embedUrl}?autoplay=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={handlePlay}
            className="w-full h-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="w-14 h-14 rounded-full bg-brand-primary/90 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium opacity-80">{video.title}</span>
            </div>
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{video.title}</h3>
          {pos && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${POSITION_COLORS[pos] || 'bg-gray-100 text-gray-600'}`}>
              {pos}
            </span>
          )}
        </div>

        {video.description && (
          <p className="text-xs text-brand-muted line-clamp-2 mb-2">{video.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-brand-muted">
            <span className="font-medium text-gray-700">{video.user?.name || video.user?.username}</span>
            <span>·</span>
            <span>{video.views} {t.scout.views}</span>
          </div>
          {showDelete && (
            <button
              onClick={() => onDelete(video._id)}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Elimina
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
