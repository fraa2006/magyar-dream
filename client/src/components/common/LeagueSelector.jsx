import { useApi } from '../../hooks/useApi.js';

export default function LeagueSelector({ value, onChange, className = '' }) {
  const { data: leagues } = useApi('/leagues');

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input ${className}`}
    >
      <option value="">Tutte le leghe</option>
      {leagues?.map((l) => (
        <option key={l._id} value={l._id}>{l.name}</option>
      ))}
    </select>
  );
}
