import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

type Props = { data: number[]; color?: string; height?: number };

export function Sparkline({ data, color = '#4ade80', height = 44 }: Props) {
  const series = data.map((v, i) => ({ i, v }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = (max - min) * 0.25 || 0.02;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis hide domain={[min - pad, max + pad]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
