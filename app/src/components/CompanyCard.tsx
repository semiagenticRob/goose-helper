import type { DashboardData, Period } from '../types';
import { TrendChart } from './TrendChart';
import './CompanyCard.css';

function blendedSeries(data: DashboardData, period: Period): number[] {
  const a = data.teams[0].periods[period];
  const b = data.teams[1].periods[period];
  const aWeight = data.teams[0].periods[period].people.length;
  const bWeight = data.teams[1].periods[period].people.length;
  const total = aWeight + bWeight;
  const len = Math.min(a.trend.length, b.trend.length);
  const out: number[] = [];
  for (let i = a.trend.length - len, j = b.trend.length - len, k = 0; k < len; i++, j++, k++) {
    out.push((a.trend[i] * aWeight + b.trend[j] * bWeight) / total);
  }
  return out;
}

function blendedCurrent(data: DashboardData, period: Period): number {
  const a = data.teams[0].periods[period];
  const b = data.teams[1].periods[period];
  const aWeight = a.people.length;
  const bWeight = b.people.length;
  const aUtil = a.confirmedBillable + a.unmappedProbable;
  const bUtil = b.confirmedBillable + b.unmappedProbable;
  return (aUtil * aWeight + bUtil * bWeight) / (aWeight + bWeight);
}

export function CompanyCard({ data, period }: { data: DashboardData; period: Period }) {
  const trend = blendedSeries(data, period);
  const current = blendedCurrent(data, period);
  const prev = trend.length >= 2 ? trend[trend.length - 2] : current;
  const delta = (current - prev) * 100;
  const up = delta >= 0;

  return (
    <div className="company-card">
      <div className="company-card-head">
        <div>
          <div className="label">Company · Blended utilization</div>
          <div className="company-hero">
            <span className="hero-num">{(current * 100).toFixed(0)}%</span>
            <span className={`delta ${up ? 'up' : 'down'}`}>
              {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} pts vs prev
            </span>
          </div>
        </div>
        <div className="company-sparkline">
          <TrendChart data={trend} period={period} height={120} compact />
        </div>
      </div>
      <div className="company-note">
        Person-weighted average of total utilization (confirmed + probable) across both teams.
      </div>
    </div>
  );
}
