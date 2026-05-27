'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CategorySummary } from '@/types';
import type { Category } from '@/types';
import { formatAmount } from '@/lib/utils/formatter';

/** Catppuccin Macchiato hex values per category */
const CATEGORY_COLORS: Record<Category, string> = {
  식비:         '#f5a97f', // peach
  카페:         '#8aadf4', // blue
  쇼핑:         '#c6a0f6', // mauve
  교통:         '#8bd5ca', // teal
  구독서비스:   '#a6da95', // green
  '뷰티/헬스':  '#f5bde6', // pink
  엔터테인먼트: '#91d7e3', // sky
  의료:         '#ed8796', // red
  교육:         '#eed49f', // yellow
  여행:         '#7dc4e4', // sapphire
  기타:         '#6e738d', // overlay0
};

interface DonutChartProps {
  data: CategorySummary[];
  totalAmount: number;
}

export default function DonutChart({ data, totalAmount }: DonutChartProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Donut + center label */}
      <div className="relative w-full max-w-[260px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={104}
              paddingAngle={2}
              dataKey="totalAmount"
              nameKey="category"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? '#6e738d'}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' ? formatAmount(value) : String(value),
                '',
              ]}
              contentStyle={{
                background: '#363a4f',
                border: '1px solid #494d64',
                borderRadius: '8px',
                color: '#cad3f5',
                fontSize: '12px',
                padding: '6px 10px',
              }}
              itemStyle={{ color: '#cad3f5' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[11px] text-ctp-subtext-1 mb-0.5">총 지출</p>
          <p className="text-base font-bold text-ctp-text leading-tight">
            {formatAmount(totalAmount)}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: CATEGORY_COLORS[item.category] ?? '#6e738d' }}
              />
              <span className="text-ctp-subtext-1 truncate">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span className="text-[11px] text-ctp-subtext-0">{item.ratio}%</span>
              <span className="text-ctp-text font-medium">{formatAmount(item.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
