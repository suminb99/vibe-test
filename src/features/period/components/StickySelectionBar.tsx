'use client';

import type { Transaction } from '@/types';
import { formatAmount } from '@/lib/utils/formatter';

interface StickySelectionBarProps {
  selectedTransactions: Transaction[];
  selectedTotal: number;
  onReset: () => void;
}

export default function StickySelectionBar({
  selectedTransactions,
  selectedTotal,
  onReset,
}: StickySelectionBarProps) {
  const count = selectedTransactions.length;

  /* 선택 없음 — 숨김 */
  if (count === 0) return null;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-5 py-3 bg-ctp-mantle border-t border-ctp-surface-1 safe-area-bottom"
      role="status"
      aria-live="polite"
      aria-label={`${count}건 선택, 합계 ${formatAmount(selectedTotal)}`}
    >
      <p className="text-sm text-ctp-text leading-snug">
        <span className="font-bold text-ctp-mauve">{count}건</span>
        {' '}선택 · 합계{' '}
        <span className="font-bold text-ctp-mauve">{formatAmount(selectedTotal)}</span>
      </p>
      <button
        onClick={onReset}
        className="shrink-0 text-xs text-ctp-subtext-1 hover:text-ctp-red transition-colors duration-100 border border-ctp-surface-2 rounded-[6px] px-3 py-1.5 min-h-[36px]"
        aria-label="선택 초기화"
      >
        초기화
      </button>
    </div>
  );
}
