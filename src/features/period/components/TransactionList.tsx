'use client';

import Badge from '@/components/ui/Badge';
import type { Transaction } from '@/types';
import { formatAmount, formatDate } from '@/lib/utils/formatter';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-ctp-subtext-1 text-center py-10">
        거래 내역이 없습니다
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {sorted.map((tx, i) => (
        <div
          key={`${tx.date}-${tx.merchant}-${i}`}
          className={[
            'flex items-center justify-between px-4 py-3 rounded-[8px]',
            tx.isCancel ? '' : 'hover:bg-ctp-surface-0 transition-colors',
          ].join(' ')}
        >
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'text-sm font-medium truncate',
                  tx.isCancel
                    ? 'text-ctp-overlay-1 line-through'
                    : 'text-ctp-text',
                ].join(' ')}
              >
                {tx.merchant}
              </span>
              {tx.isCancel && <Badge label="취소" variant="cancel" />}
              {!tx.isCancel && (
                <Badge label={tx.category} category={tx.category} />
              )}
            </div>
            <span className="text-xs text-ctp-subtext-1">{formatDate(tx.date)}</span>
          </div>
          <span
            className={[
              'text-sm font-semibold whitespace-nowrap ml-4',
              tx.isCancel ? 'text-ctp-overlay-1' : 'text-ctp-text',
            ].join(' ')}
          >
            {formatAmount(tx.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
