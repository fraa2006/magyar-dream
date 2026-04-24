import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

function FormBadge({ result, labels }) {
  if (result === 'W') return <span className="badge-form-W">{labels.W}</span>;
  if (result === 'D') return <span className="badge-form-D">{labels.D}</span>;
  if (result === 'L') return <span className="badge-form-L">{labels.L}</span>;
  return null;
}

function TeamLogo({ logo, name, color }) {
  if (logo) {
    return <img src={logo} alt={name} className="w-6 h-6 object-contain" />;
  }
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
      style={{ backgroundColor: color || '#444' }}
    >
      {name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

const FORM_LABELS = {
  it: { W: 'V', D: 'P', L: 'S' },
  en: { W: 'W', D: 'D', L: 'L' },
  hu: { W: 'Gy', D: 'D', L: 'V' },
};

export default function StandingsTable({ standings = [] }) {
  const { t, lang } = useLanguage();
  const formLabels = FORM_LABELS[lang] || FORM_LABELS.it;

  if (standings.length === 0) {
    return (
      <div className="card py-10 text-center text-brand-muted text-sm">
        {t.standings.noData}
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-border text-brand-muted text-xs uppercase">
            <th className="py-3 px-2 font-medium text-center">{t.standings.position}</th>
            <th className="py-3 px-2 font-medium text-left">{t.standings.team}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.played}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.won}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.drawn}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.lost}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.goalsFor}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.goalsAgainst}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.goalDiff}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.points}</th>
            <th className="py-3 px-2 font-medium text-center">{t.standings.form}</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => {
            const position = index + 1;
            const isEuropa = position <= 2;
            const isRelegation = position > standings.length - 3;

            let rowBorderClass = '';
            if (isEuropa) rowBorderClass = 'border-l-2 border-l-green-500';
            else if (isRelegation) rowBorderClass = 'border-l-2 border-l-red-600';

            const goalDiff = row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff;

            return (
              <tr
                key={row.team._id}
                className={`border-b border-brand-border last:border-0 hover:bg-gray-50 transition-colors ${rowBorderClass}`}
              >
                <td className="py-3 px-2 text-center font-semibold text-brand-muted">
                  {position}
                </td>
                <td className="py-3 px-2">
                  <Link
                    to={`/squadre/${row.team._id}`}
                    className="flex items-center gap-2 hover:text-brand-primary transition-colors"
                  >
                    <TeamLogo
                      logo={row.team.logo}
                      name={row.team.shortName}
                      color={row.team.primaryColor}
                    />
                    <span className="font-medium text-gray-900 hidden sm:block">
                      {row.team.name}
                    </span>
                    <span className="font-medium text-gray-900 sm:hidden">
                      {row.team.shortName}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-2 text-center text-gray-700">{row.played}</td>
                <td className="py-3 px-2 text-center text-gray-700">{row.won}</td>
                <td className="py-3 px-2 text-center text-gray-700">{row.drawn}</td>
                <td className="py-3 px-2 text-center text-gray-700">{row.lost}</td>
                <td className="py-3 px-2 text-center text-gray-700">{row.goalsFor}</td>
                <td className="py-3 px-2 text-center text-gray-700">{row.goalsAgainst}</td>
                <td className="py-3 px-2 text-center text-gray-700">{goalDiff}</td>
                <td className="py-3 px-2 text-center font-extrabold text-gray-900 text-base">
                  {row.points}
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-1 justify-center">
                    {row.form.map((result, i) => (
                      <FormBadge key={i} result={result} labels={formLabels} />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="px-4 py-3 border-t border-brand-border flex flex-wrap gap-4 text-xs text-brand-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-green-500 rounded inline-block" />
          {t.standings.europe}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-red-600 rounded inline-block" />
          {t.standings.relegation}
        </span>
        <span className="ml-auto">{t.standings.legend}</span>
      </div>
    </div>
  );
}
