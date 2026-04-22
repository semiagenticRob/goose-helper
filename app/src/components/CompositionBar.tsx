import './CompositionBar.css';

type Props = {
  confirmedBillable: number;
  unmappedProbable: number;
  nonBillable: number;
  height?: number;
  showLegend?: boolean;
};

export function CompositionBar({
  confirmedBillable,
  unmappedProbable,
  nonBillable,
  height = 10,
  showLegend = false,
}: Props) {
  const total = confirmedBillable + unmappedProbable + nonBillable;
  const idle = Math.max(0, 1 - total);
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  return (
    <div className="composition-bar-wrap">
      <div
        className="composition-bar"
        style={{ height }}
        role="img"
        aria-label={`Composition: ${pct(confirmedBillable)} billable, ${pct(unmappedProbable)} unmapped, ${pct(nonBillable)} non-billable`}
      >
        {confirmedBillable > 0 && (
          <div className="seg billable" style={{ width: pct(confirmedBillable) }} />
        )}
        {unmappedProbable > 0 && (
          <div className="seg unmapped" style={{ width: pct(unmappedProbable) }} />
        )}
        {nonBillable > 0 && (
          <div className="seg non-billable" style={{ width: pct(nonBillable) }} />
        )}
        {idle > 0 && <div className="seg idle" style={{ width: pct(idle) }} />}
      </div>
      {showLegend && (
        <div className="composition-legend">
          <span><i className="swatch billable" /> Billable ({pct(confirmedBillable)})</span>
          {unmappedProbable > 0 && (
            <span><i className="swatch unmapped" /> Unmapped ({pct(unmappedProbable)})</span>
          )}
          <span><i className="swatch non-billable" /> Non-billable ({pct(nonBillable)})</span>
          {idle > 0 && <span><i className="swatch idle" /> Idle ({pct(idle)})</span>}
        </div>
      )}
    </div>
  );
}
