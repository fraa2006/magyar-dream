import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

function TeamLogo({ logo, name, color = '#444' }) {
  if (logo) {
    return <img src={logo} alt={name} className="w-9 h-9 object-contain drop-shadow-sm" />;
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0 shadow-sm"
      style={{ backgroundColor: color }}
    >
      {name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function MatchCard({ match, showLeague = true }) {
  const { homeTeam, awayTeam, homeScore, awayScore, date, status, league, matchday } = match;
  const isFinished = status === 'finished';
  const isLive = status === 'live';
  const isScheduled = status === 'scheduled';

  const homeWon = isFinished && homeScore > awayScore;
  const awayWon = isFinished && awayScore > homeScore;

  return (
    <Link
      to={`/partite/${match._id}`}
      className="card-hover group block"
    >
      {/* Colored top accent using team colors */}
      <div
        className="h-0.5 w-full opacity-70"
        style={{ background: `linear-gradient(90deg, ${homeTeam?.primaryColor || '#CE2939'}, ${awayTeam?.primaryColor || '#477050'})` }}
      />

      <div className="px-4 py-3">
        {showLeague && (
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] text-brand-muted font-medium uppercase tracking-wide">
              {league?.shortName} · {matchday}
            </span>
            {isLive ? (
              <span className="live-dot text-[11px] font-bold text-green-600 animate-pulse">LIVE</span>
            ) : (
              <span className="text-[11px] text-brand-muted capitalize">{
                isFinished ? '—' : isScheduled ? format(new Date(date), 'd MMM', { locale: it }) : '—'
              }</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Home team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <TeamLogo logo={homeTeam?.logo} name={homeTeam?.shortName} color={homeTeam?.primaryColor} />
            <div className="min-w-0">
              <p className={`font-semibold truncate leading-tight ${homeWon ? 'text-gray-900' : isFinished ? 'text-gray-400' : 'text-gray-900'}`}>
                <span className="hidden sm:block">{homeTeam?.name}</span>
                <span className="sm:hidden">{homeTeam?.shortName}</span>
              </p>
            </div>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center shrink-0 min-w-[80px]">
            {isFinished || isLive ? (
              <div className="flex items-center gap-1">
                <span className={`text-xl font-extrabold tabular-nums w-7 text-right ${homeWon ? 'text-gray-900' : isFinished ? 'text-gray-400' : 'text-gray-900'} ${isLive ? 'text-green-600' : ''}`}>
                  {homeScore}
                </span>
                <span className="text-brand-muted font-bold px-0.5">–</span>
                <span className={`text-xl font-extrabold tabular-nums w-7 text-left ${awayWon ? 'text-gray-900' : isFinished ? 'text-gray-400' : 'text-gray-900'} ${isLive ? 'text-green-600' : ''}`}>
                  {awayScore}
                </span>
              </div>
            ) : (
              <div className="text-center bg-gray-100 rounded-lg px-3 py-1">
                <div className="text-sm font-bold text-brand-gold leading-none">
                  {format(new Date(date), 'HH:mm')}
                </div>
                <div className="text-[10px] text-brand-muted mt-0.5">
                  {format(new Date(date), 'd MMM', { locale: it })}
                </div>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <div className="min-w-0 text-right">
              <p className={`font-semibold truncate leading-tight ${awayWon ? 'text-gray-900' : isFinished ? 'text-gray-400' : 'text-gray-900'}`}>
                <span className="hidden sm:block">{awayTeam?.name}</span>
                <span className="sm:hidden">{awayTeam?.shortName}</span>
              </p>
            </div>
            <TeamLogo logo={awayTeam?.logo} name={awayTeam?.shortName} color={awayTeam?.primaryColor} />
          </div>
        </div>
      </div>
    </Link>
  );
}
