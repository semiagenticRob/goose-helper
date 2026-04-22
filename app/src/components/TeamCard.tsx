import type { Period, Team } from '../types';
import { CompositionBar } from './CompositionBar';
import { PersonTable } from './PersonTable';
import { Sparkline } from './Sparkline';
import './TeamCard.css';

type Props = {
  team: Team;
  period: Period;
  expanded: boolean;
  onToggle: () => void;
};

export function TeamCard({ team, period, expanded, onToggle }: Props) {
  const slice = team.periods[period];
  const utilization = slice.confirmedBillable + slice.unmappedProbable;
  const hasUnmapped = slice.unmappedProbable > 0;
  const prev = slice.trend[slice.trend.length - 2] ?? utilization;
  const delta = (utilization - prev) * 100;
  const up = delta >= 0;

  return (
    <div
      className={`team-card ${expanded ? 'expanded' : ''} ${team.type}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      aria-expanded={expanded}
    >
      <div className="team-card-head">
        <div className="team-title">
          <h3>{team.name}</h3>
          <span className={`tag ${team.type}`}>
            {team.type === 'external' ? 'Long-term engagements' : 'One-off projects'}
          </span>
        </div>
        {hasUnmapped && (
          <span className="conf-badge" title="Mapping confidence — fraction of hours that cleanly tie to billable projects">
            mapping conf {(slice.mappingConfidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="team-hero">
        <span className="hero-num">{(utilization * 100).toFixed(0)}%</span>
        <div className="hero-meta">
          {hasUnmapped ? (
            <span className="caption">
              {(slice.confirmedBillable * 100).toFixed(0)}% confirmed
              {' + '}
              {(slice.unmappedProbable * 100).toFixed(0)}% probable
            </span>
          ) : (
            <span className="caption">{(slice.confirmedBillable * 100).toFixed(0)}% confirmed billable</span>
          )}
          <span className={`delta ${up ? 'up' : 'down'}`}>
            {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)} pts · target {Math.round(team.target * 100)}%
          </span>
        </div>
      </div>

      <CompositionBar
        confirmedBillable={slice.confirmedBillable}
        unmappedProbable={slice.unmappedProbable}
        nonBillable={slice.nonBillable}
        height={expanded ? 14 : 10}
        showLegend={expanded}
      />

      {expanded && (
        <>
          <div className="team-sparkline">
            <div className="label-tiny">Trend</div>
            <Sparkline
              data={slice.trend}
              color={hasUnmapped ? 'var(--amber)' : 'var(--billable)'}
              height={48}
            />
          </div>
          <PersonTable people={slice.people} showUnmapped={hasUnmapped} />
        </>
      )}

      {!expanded && (
        <div className="expand-hint">{slice.people.length} people · click to expand →</div>
      )}
    </div>
  );
}
