'use client';

import type { Transaction } from '@/types';
import { formatAmount } from '@/lib/utils/formatter';

interface SelectionPanelProps {
  selectedTransactions: Transaction[];
  selectedTotal: number;
  onReset: () => void;
}

export default function SelectionPanel({
  selectedTransactions,
  selectedTotal,
  onReset,
}: SelectionPanelProps) {
  const count = selectedTransactions.length;

  /* 선택 없음 — 빈 안내 상태 */
  if (count === 0) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center text-center gap-2 px-5 py-8 rounded-[12px] border border-ctp-surface-1 bg-ctp-surface-0 min-h-[120px]">
        <span className="text-xl">☝️</span>
        <p className="text-xs text-ctp-subtext-1 leading-relaxed">
          항목을 클릭하면<br />합산 금액이 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col rounded-[12px] border border-[rgba(198,160,246,0.4)] bg-ctp-surface-0 overflow-hidden sticky top-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ctp-surface-1">
        <span className="text-sm font-semibold text-ctp-text">
          {count}건 선택됨
        </span>
        <button
          onClick={onReset}
          className="text-xs text-ctp-subtext-1 hover:text-ctp-red transition-colors duration-100 px-1"
          aria-label="선택 초기화"
        >
          초기화
        </button>
      </div>

      {/* 선택 항목 리스트 */}
      <ul className="flex flex-col max-h-60 overflow-y-auto" role="list">
        {selectedTransactions.map((tx) => (
          <li
            key={tx.id}
            className="flex items-center justify-between px-4 py-2.5 border-b border-ctp-surface-0 last:border-b-0 gap-2"
          >
            <span className="text-xs text-ctp-subtext-1 truncate min-w-0">
              {tx.merchant}
            </span>
            <span className="text-xs font-medium text-ctp-text whitespace-nowrap shrink-0">
              {formatAmount(tx.amount)}
            </span>
          </li>
        ))}
      </ul>

      {/* 합계 */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-[rgba(198,160,246,0.08)] border-t border-[rgba(198,160,246,0.2)]">
        <span className="text-xs text-ctp-subtext-1">합계</span>
        <span className="text-lg font-bold text-ctp-mauve">
          {formatAmount(selectedTotal)}
        </span>
      </div>
    </div>
  );
}
