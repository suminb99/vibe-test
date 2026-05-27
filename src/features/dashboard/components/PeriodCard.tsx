'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Category } from '@/types';
import { formatAmount, formatPeriodLabel } from '@/lib/utils/formatter';

interface PeriodCardProps {
  period: string;
  totalAmount: number;
  topCategory: Category | null;
}

export default function PeriodCard({ period, totalAmount, topCategory }: PeriodCardProps) {
  const router = useRouter();

  return (
    <Card
      interactive
      onClick={() => router.push(`/dashboard/${period}`)}
      className="flex flex-col gap-3"
    >
      <p className="text-xs text-ctp-subtext-1 font-medium">{formatPeriodLabel(period)}</p>
      <p className="text-2xl font-bold text-ctp-text">{formatAmount(totalAmount)}</p>
      {topCategory && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ctp-subtext-0">최다 지출</span>
          <Badge label={topCategory} category={topCategory} />
        </div>
      )}
    </Card>
  );
}
