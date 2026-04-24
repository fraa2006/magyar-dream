import { Link } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext.jsx';

export default function Footer() {
  const { t, lang, changeLang } = useLanguage();

  const NAV_LINKS = [
    ['/', t.nav.home],
    ['/classifica', t.nav.standings],
    ['/risultati', t.nav.results],
    ['/calendario', t.nav.calendar],
    ['/marcatori', t.nav.scorers],
    ['/squadre', t.nav.teams],
  ];

  return (
    <footer className="bg-white border-t border-brand-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex-col h-5 w-1 rounded overflow-hidden">
                <div className="flex-1 bg-hungarian-red" />
                <div className="flex-1 bg-gray-200" />
                <div className="flex-1 bg-hungarian-green" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                <span className="text-hungarian-green">Magyar</span><span className="text-hungarian-red">Dream</span>
              </span>
            </div>
            <p className="text-sm text-brand-muted mb-4">{t.footer.desc}</p>

            <div className="flex gap-2">
              {LANGUAGES.map(({ code, flag, label }) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  title={label}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    lang === code
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-brand-border text-brand-muted hover:border-brand-primary hover:text-gray-900'
                  }`}
                >
                  <span>{flag}</span>
                  <span>{code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t.footer.navigation}</h3>
            <ul className="space-y-2 text-sm text-brand-muted">
              {NAV_LINKS.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-gray-900 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t.footer.leagues}</h3>
            <ul className="space-y-2 text-sm text-brand-muted">
              {[['nb1', 'NB I — Nemzeti Bajnokság I'], ['nb2', 'NB II — Nemzeti Bajnokság II'], ['u19', 'U19 Liga']].map(([slug, name]) => (
                <li key={slug}>
                  <Link to={`/classifica/${slug}`} className="hover:text-gray-900 transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 text-center text-sm text-brand-muted">
          © {new Date().getFullYear()} Magyar Dream · {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
