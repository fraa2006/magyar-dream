import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="max-w-xl mx-auto px-4 py-32 text-center">
      <div className="text-8xl font-extrabold text-brand-primary opacity-50 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{t.common.notFound}</h1>
      <p className="text-brand-muted mb-8">{t.common.notFoundDesc}</p>
      <Link to="/" className="btn-primary">{t.common.backHome}</Link>
    </div>
  );
}
