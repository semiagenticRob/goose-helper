import { Fragment, useState } from 'react';
import type { PersonRow, Period } from '../types';
import { UNMAPPED_FLAG_HOURS, UTIL_THRESHOLDS } from '../constants';
import { PersonDetail } from './PersonDetail';
import './PersonTable.css';

function utilColor(u: number) {
  if (u >= UTIL_THRESHOLDS.green) return 'var(--billable)';
  if (u >= UTIL_THRESHOLDS.amber) return 'var(--amber)';
  return 'var(--red)';
}

export function PersonTable({
  people,
  showUnmapped,
  period,
}: {
  people: PersonRow[];
  showUnmapped: boolean;
  period: Period;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const sorted = [...people].sort((a, b) => b.utilization - a.utilization);

  const handleClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setSelected(prev => (prev === name ? null : name));
  };

  return (
    <div className="person-table-wrap">
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
          {sorted.map(p => {
            const isSelected = selected === p.name;
            return (
              <Fragment key={p.name}>
                <tr
                  className={`person-row ${isSelected ? 'selected' : ''}`}
                  onClick={e => handleClick(e, p.name)}
                  aria-expanded={isSelected}
                >
                  <td className="name">
                    <span className={`caret ${isSelected ? 'open' : ''}`}>▸</span>
                    {p.name}
                  </td>
                  <td className="num">{(p.utilization * 100).toFixed(0)}%</td>
                  <td className="bar-col">
                    <div className="person-bar">
                      <span
                        style={{
                          width: `${p.utilization * 100}%`,
                          background: utilColor(p.utilization),
                        }}
                      />
                    </div>
                  </td>
                  {showUnmapped && (
                    <td className="num">
                      <span
                        className={`flag ${p.unmappedHours > UNMAPPED_FLAG_HOURS ? 'warn' : 'ok'}`}
                      >
                        {p.unmappedHours}h
                      </span>
                    </td>
                  )}
                </tr>
                {isSelected && (
                  <tr className="person-detail-row">
                    <td colSpan={showUnmapped ? 4 : 3}>
                      <PersonDetail person={p} period={period} />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
