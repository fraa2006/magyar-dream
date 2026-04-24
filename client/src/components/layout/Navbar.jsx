import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { lang, changeLang, t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const currentLang = LANGUAGES.find(l => l.code === lang);

  const LINKS = [
    { to: '/', label: t.nav.home },
    { to: '/classifica', label: t.nav.standings },
    { to: '/risultati', label: t.nav.results },
    { to: '/calendario', label: t.nav.calendar },
    { to: '/marcatori', label: t.nav.scorers },
    { to: '/squadre', label: t.nav.teams },
    { to: '/scout', label: t.nav.scout },
  ];

  return (
    <nav className="bg-white border-b border-brand-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-5 w-1 rounded-full overflow-hidden flex-col">
              <div className="flex-1 bg-hungarian-red" />
              <div className="flex-1 bg-white border-y border-brand-border" />
              <div className="flex-1 bg-hungarian-green" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-hungarian-green">Magyar</span><span className="text-hungarian-red">Dream</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">

            <div className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all border border-transparent hover:border-brand-border"
              >
                <span className="text-base">{currentLang?.flag}</span>
                <span className="font-medium">{currentLang?.code.toUpperCase()}</span>
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden z-20">
                    {LANGUAGES.map(({ code, label, flag }) => (
                      <button
                        key={code}
                        onClick={() => { changeLang(code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                          lang === code
                            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{flag}</span>
                        <span>{label}</span>
                        {lang === code && <span className="ml-auto text-brand-primary">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user ? (
              isAdmin ? (
                <>
                  <Link to="/admin" className="text-sm text-brand-gold hover:text-amber-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium">
                    ⚙ {t.nav.admin}
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 border border-brand-border transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center text-xs font-bold text-brand-secondary">
                      {(user.name || user.username).charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-24 truncate">{user.name || user.username}</span>
                    {user.isPremium && <span className="text-brand-primary text-xs">★</span>}
                    <svg className={`w-3 h-3 transition-transform ${userOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden z-20">
                        <Link to="/dashboard" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <span>👤</span> {t.nav.dashboard}
                        </Link>
                        {!user.isPremium && (
                          <Link to="/premium" onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-primary font-medium hover:bg-brand-primary/5">
                            <span>★</span> Premium
                          </Link>
                        )}
                        <div className="border-t border-brand-border" />
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                          <span>→</span> {t.nav.logout}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-3">
                  {t.nav.login}
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <div className="flex gap-1">
              {LANGUAGES.map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => changeLang(code)}
                  className={`text-base p-1 rounded transition-all ${lang === code ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
                  title={code.toUpperCase()}
                >
                  {flag}
                </button>
              ))}
            </div>
            <button
              className="text-gray-500 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-3 pt-1 space-y-0.5 border-t border-brand-border">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-1 border-t border-brand-border space-y-0.5">
              {user ? (
                isAdmin ? (
                  <>
                    <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-brand-gold font-medium">⚙ {t.nav.admin}</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900">{t.nav.logout}</button>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 font-medium">{t.nav.dashboard}</Link>
                    {!user.isPremium && (
                      <Link to="/premium" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-brand-primary font-semibold">★ Premium</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900">{t.nav.logout}</button>
                  </>
                )
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 font-medium">{t.nav.login}</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-brand-primary font-semibold">{t.nav.register}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
