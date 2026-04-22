import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Period } from '../types';

const PERIOD_UNIT: Record<Period, string> = {
  week: 'wk',
  month: 'mo',
  quarter: 'q',
};

type Props = {
  data: number[];
  period: Period;
  color?: string;
  height?: number;
  target?: number;
  compact?: boolean;
};

export function TrendChart({
  data,
  period,
  color = '#4ade80',
  height = 160,
  target,
  compact = false,
}: Props) {
  const unit = PERIOD_UNIT[period];
  const n = data.length;
  const series = data.map((v, i) => {
    const offset = n - 1 - i;
    const label = offset === 0 ? 'now' : `−${offset}${unit}`;
    return { label, offset, value: v * 100 };
  });

  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = Math.max(0.02, (max - min) * 0.35);
  const yMin = Math.max(0, (min - pad) * 100);
  const yMax = Math.min(100, (max + pad) * 100);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
        >
          <CartesianGrid stroke="#2a3038" strokeDasharray="2 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            interval={compact ? Math.ceil(n / 4) - 1 : 'preserveStartEnd'}
            tickLine={false}
            axisLine={{ stroke: '#2a3038' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v: number) => `${Math.round(v)}%`}
            domain={[yMin, yMax]}
            width={38}
            tickLine={false}
            axisLine={{ stroke: '#2a3038' }}
          />
          {target !== undefined && (
            <ReferenceLine
              y={target * 100}
              stroke="#6b7280"
              strokeDasharray="4 3"
              label={{
                value: `target ${Math.round(target * 100)}%`,
                position: 'insideTopRight',
                fill: '#9ca3af',
                fontSize: 10,
              }}
            />
          )}
          <Tooltip
            contentStyle={{
              background: '#14181d',
              border: '1px solid #2a3038',
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#e5e7eb' }}
            formatter={(v: number) => [`${v.toFixed(1)}%`, 'Utilization']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 2, fill: color }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
