import type { PersonRow } from '../types';
import { UNMAPPED_FLAG_HOURS, UTIL_THRESHOLDS } from '../constants';
import './PersonTable.css';

function utilColor(u: number) {
  if (u >= UTIL_THRESHOLDS.green) return 'var(--billable)';
  if (u >= UTIL_THRESHOLDS.amber) return 'var(--amber)';
  return 'var(--red)';
}

export function PersonTable({
  people,
  showUnmapped,
}: {
  people: PersonRow[];
  showUnmapped: boolean;
}) {
  const sorted = [...people].sort((a, b) => b.utilization - a.utilization);

  return (
    <table className="person-table">
      <thead>
        <tr>
          <th>Name</th>
          <th className="num">Util</th>
          <th className="bar-col"></th>
          {showUnmapped && <th className="num">Unmapped</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.map(p => (
          <tr key={p.name}>
            <td className="name">{p.name}</td>
            <td className="num">{(p.utilization * 100).toFixed(0)}%</td>
            <td className="bar-col">
              <div className="person-bar">
                <span style={{ width: `${p.utilization * 100}%`, background: utilColor(p.utilization) }} />
              </div>
            </td>
            {showUnmapped && (
              <td className="num">
                <span className={`flag ${p.unmappedHours > UNMAPPED_FLAG_HOURS ? 'warn' : 'ok'}`}>
                  {p.unmappedHours}h
                </span>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
