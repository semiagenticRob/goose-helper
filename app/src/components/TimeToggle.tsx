import type { Period } from '../types';
import './TimeToggle.css';

const OPTIONS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
];

export function TimeToggle({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="time-toggle" role="tablist" aria-label="Time period">
      {OPTIONS.map(opt => (
        <button
          key={opt.key}
          role="tab"
          aria-selected={value === opt.key}
          className={value === opt.key ? 'active' : ''}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
