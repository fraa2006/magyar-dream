import { Link } from 'react-router-dom';

export default function TeamCard({ team }) {
  return (
    <Link
      to={`/squadre/${team._id}`}
      className="card-hover group relative overflow-hidden"
    >
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${team.primaryColor || '#CE2939'}, ${team.secondaryColor || '#333'})` }}
      />

      <div className="p-5 text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-extrabold text-lg shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: team.primaryColor || '#333' }}
        >
          {team.logo
            ? <img src={team.logo} alt={team.name} className="w-14 h-14 object-contain" />
            : team.shortName?.slice(0, 3)
          }
        </div>

        <h3 className="font-bold text-white text-sm leading-tight group-hover:text-brand-primary transition-colors">
          {team.name}
        </h3>
        <p className="text-xs text-brand-muted mt-1">{team.city}</p>

        {(team.founded || team.stadium) && (
          <div className="mt-2 pt-2 border-t border-brand-border/50 space-y-0.5">
            {team.founded && <p className="text-[11px] text-brand-muted">Est. {team.founded}</p>}
            {team.stadium && <p className="text-[11px] text-brand-muted truncate">{team.stadium}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}
