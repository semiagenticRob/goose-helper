import type { PersonRow, Period } from '../types';
import { CompositionBar } from './CompositionBar';
import './PersonDetail.css';

const PERIOD_LABEL: Record<Period, string> = {
  week: 'this week',
  month: 'this month',
  quarter: 'this quarter',
};

type Props = { person: PersonRow; period: Period };

export function PersonDetail({ person, period }: Props) {
  const { breakdown, utilization, unmappedHours } = person;
  const hoursAvail = breakdown.hoursAvailable;
  const hoursBillable = Math.round(breakdown.confirmedBillable * hoursAvail);
  const hoursNonBillable = Math.round(breakdown.nonBillable * hoursAvail);
  const hoursIdle = Math.max(0, hoursAvail - breakdown.hoursWorked);

  return (
    <div className="person-detail">
      <div className="person-detail-head">
        <div>
          <div className="label">Breakdown · {PERIOD_LABEL[period]}</div>
          <div className="person-detail-name">{person.name}</div>
        </div>
        <div className="person-detail-util">
          <span className="num">{(utilization * 100).toFixed(0)}%</span>
          <span className="label">utilization</span>
        </div>
      </div>

      <CompositionBar
        confirmedBillable={breakdown.confirmedBillable}
        unmappedProbable={breakdown.unmappedProbable}
        nonBillable={breakdown.nonBillable}
        height={12}
        showLegend={true}
      />

      <div className="person-hours-grid">
        <div className="hour-cell">
          <div className="hour-label">Billable</div>
          <div className="hour-value">{hoursBillable}h</div>
        </div>
        {breakdown.unmappedProbable > 0 && (
          <div className="hour-cell warn">
            <div className="hour-label">Unmapped</div>
            <div className="hour-value">{unmappedHours}h</div>
          </div>
        )}
        <div className="hour-cell">
          <div className="hour-label">Non-billable</div>
          <div className="hour-value">{hoursNonBillable}h</div>
        </div>
        <div className="hour-cell">
          <div className="hour-label">Idle</div>
          <div className="hour-value">{hoursIdle}h</div>
        </div>
        <div className="hour-cell total">
          <div className="hour-label">Available</div>
          <div className="hour-value">{hoursAvail}h</div>
        </div>
      </div>
    </div>
  );
}
