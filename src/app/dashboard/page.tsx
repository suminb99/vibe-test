'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/ui/EmptyState';
import PeriodToggle from '@/features/dashboard/components/PeriodToggle';
import PeriodCard from '@/features/dashboard/components/PeriodCard';
import { loadStatement } from '@/lib/storage';
import {
  extractMonths,
  extractYears,
  filterByPeriod,
  sumAmount,
  topCategory,
} from '@/lib/utils/filterUtils';
import type { ParsedStatement, PeriodMode } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [statement, setStatement] = useState<ParsedStatement | null>(null);
  const [mode, setMode] = useState<PeriodMode>('monthly');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const data = loadStatement();
    setStatement(data);
    setMounted(true);
  }, []);

  // 로딩 중 (첫 hydration 전)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-ctp-base">
        <AppHeader />
      </div>
    );
  }

  // 데이터 없음
  if (!statement || statement.transactions.length === 0) {
    return (
      <div className="min-h-screen bg-ctp-base">
        <AppHeader />
        <main className="flex items-center justify-center px-6 py-20">
          <EmptyState
            title="분석할 명세서가 없어요"
            description="신한카드 Excel 명세서를 업로드하면 소비 패턴을 분석해 드립니다"
            actionLabel="명세서 업로드하기"
            onAction={() => router.push('/upload')}
          />
        </main>
      </div>
    );
  }

  const { transactions } = statement;

  const periods =
    mode === 'monthly' ? extractMonths(transactions) : extractYears(transactions);

  return (
    <div className="min-h-screen bg-ctp-base">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* 헤더 행 */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ctp-text">소비 분석</h1>
          <PeriodToggle mode={mode} onChange={setMode} />
        </div>

        {/* 기간 카드 목록 */}
        {periods.length === 0 ? (
          <EmptyState
            title="기간 데이터가 없어요"
            description="명세서에 거래 내역이 없습니다"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {periods.map((period) => {
              const periodTxs = filterByPeriod(transactions, period);
              return (
                <PeriodCard
                  key={period}
                  period={period}
                  totalAmount={sumAmount(periodTxs)}
                  topCategory={topCategory(periodTxs)}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
