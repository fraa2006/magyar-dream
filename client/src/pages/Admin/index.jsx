import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const CARDS = [
  { to: '/admin/partite', emoji: '⚽', title: 'Partite', desc: 'Aggiungi, modifica e inserisci risultati. Poi clicca "Tabellino" per aggiungere gol e cartellini.' },
  { to: '/admin/squadre', emoji: '🏟️', title: 'Squadre', desc: 'Gestisci le squadre del campionato' },
  { to: '/admin/giocatori', emoji: '👤', title: 'Giocatori', desc: 'Gestisci le rose delle squadre' },
  { to: '/admin/leghe', emoji: '🏆', title: 'Leghe & Stagioni', desc: 'Configura campionati e stagioni' },
];

export default function Admin() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">
          <span style={{ color: '#477050' }}>Pannello</span>{' '}
          <span style={{ color: '#CE2939' }}>Admin</span>
        </h1>
        <p className="text-brand-muted mt-1">Benvenuto, {user?.username} · {user?.role}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map(({ to, emoji, title, desc }) => (
          <Link key={to} to={to} className="card p-6 hover:border-brand-primary transition-all hover:scale-[1.02] group">
            <div className="text-4xl mb-3">{emoji}</div>
            <h2 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{title}</h2>
            <p className="text-brand-muted text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
