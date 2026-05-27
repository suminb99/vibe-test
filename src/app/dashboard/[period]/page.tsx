'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/ui/EmptyState';
import DonutChart from '@/features/dashboard/components/DonutChart';
import TransactionList from '@/features/period/components/TransactionList';
import CategoryAccordion from '@/features/period/components/CategoryAccordion';
import { loadStatement } from '@/lib/storage';
import {
  filterByPeriod,
  sumAmount,
  aggregateByCategory,
} from '@/lib/utils/filterUtils';
import { formatAmount, formatPeriodLabel } from '@/lib/utils/formatter';
import type { ParsedStatement } from '@/types';

type Tab = 'transactions' | 'categories';

interface PeriodDetailPageProps {
  params: Promise<{ period: string }>;
}

export default function PeriodDetailPage({ params }: PeriodDetailPageProps) {
  const router = useRouter();
  const { period } = use(params);

  const [statement, setStatement] = useState<ParsedStatement | null>(null);
  const [tab, setTab] = useState<Tab>('transactions');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStatement(loadStatement());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ctp-base">
        <AppHeader />
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="min-h-screen bg-ctp-base">
        <AppHeader />
        <main className="flex items-center justify-center px-6 py-20">
          <EmptyState
            title="데이터가 없어요"
            description="명세서를 먼저 업로드해 주세요"
            actionLabel="업로드하기"
            onAction={() => router.push('/upload')}
          />
        </main>
      </div>
    );
  }

  const transactions = filterByPeriod(statement.transactions, period);
  const total = sumAmount(transactions);
  const summaries = aggregateByCategory(transactions);
  const validCount = transactions.filter((tx) => !tx.isCancel).length;
  const periodLabel = formatPeriodLabel(period);

  return (
    <div className="min-h-screen bg-ctp-base">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm" aria-label="breadcrumb">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-ctp-subtext-1 hover:text-ctp-mauve transition-colors"
          >
            대시보드
          </button>
          <span className="text-ctp-surface-2 select-none">›</span>
          <span className="text-ctp-text font-medium">{periodLabel}</span>
        </nav>

        {/* Period summary */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-ctp-text">{periodLabel}</h1>
          <p className="text-3xl font-bold text-ctp-mauve">{formatAmount(total)}</p>
          <p className="text-xs text-ctp-subtext-1 mt-1">{validCount}건의 결제</p>
        </div>

        {/* Donut chart */}
        {summaries.length > 0 && (
          <div className="bg-ctp-surface-0 rounded-[12px] p-5 border border-ctp-surface-1">
            <DonutChart data={summaries} totalAmount={total} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-ctp-surface-0 rounded-[8px] p-1 border border-ctp-surface-1">
          {(['transactions', 'categories'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'flex-1 px-4 py-1.5 rounded-[6px] text-sm font-medium transition-colors duration-150',
                tab === t
                  ? 'bg-ctp-mauve text-ctp-crust'
                  : 'text-ctp-subtext-1 hover:text-ctp-text',
              ].join(' ')}
            >
              {t === 'transactions' ? '전체 결제 내역' : '카테고리별 지출'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'transactions' ? (
          <TransactionList transactions={transactions} />
        ) : (
          <CategoryAccordion summaries={summaries} transactions={transactions} />
        )}
      </main>
    </div>
  );
}
