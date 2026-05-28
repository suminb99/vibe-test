'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import type { CategorySummary, Transaction } from '@/types';
import { formatAmount } from '@/lib/utils/formatter';

interface CategoryAccordionProps {
  summaries: CategorySummary[];
  transactions: Transaction[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export default function CategoryAccordion({
  summaries,
  transactions,
  selectedIds = new Set(),
  onToggleSelect,
}: CategoryAccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (category: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (summaries.length === 0) {
    return (
      <p className="text-sm text-ctp-subtext-1 text-center py-10">
        카테고리 데이터가 없습니다
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {summaries.map((summary) => {
        const isOpen = expanded.has(summary.category);
        const categoryTxs = transactions
          .filter((tx) => tx.category === summary.category && !tx.isCancel)
          .sort((a, b) => b.date.localeCompare(a.date));

        return (
          <div
            key={summary.category}
            className="rounded-[12px] border border-ctp-surface-1 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => toggle(summary.category)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-ctp-surface-0 hover:bg-ctp-surface-1 transition-colors duration-150"
            >
              <div className="flex items-center gap-2.5">
                <Badge label={summary.category} category={summary.category} />
                <span className="text-xs text-ctp-subtext-1">{summary.count}건</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-ctp-subtext-0">{summary.ratio}%</span>
                <span className="text-sm font-semibold text-ctp-text">
                  {formatAmount(summary.totalAmount)}
                </span>
                <svg
                  className={[
                    'w-4 h-4 text-ctp-subtext-1 transition-transform duration-150',
                    isOpen ? 'rotate-180' : '',
                  ].join(' ')}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="bg-ctp-base border-t border-ctp-surface-1">
                {categoryTxs.length === 0 ? (
                  <p className="text-xs text-ctp-subtext-1 text-center py-4">내역 없음</p>
                ) : (
                  categoryTxs.map((tx) => {
                    const isSelected = selectedIds.has(tx.id);
                    return (
                      <button
                        key={tx.id}
                        onClick={() => onToggleSelect?.(tx.id)}
                        className={[
                          'w-full flex items-center justify-between px-4 py-3',
                          'border-b border-ctp-surface-0 last:border-b-0',
                          'text-left transition-colors duration-100',
                          onToggleSelect ? 'cursor-pointer' : 'cursor-default',
                          isSelected
                            ? 'bg-[rgba(198,160,246,0.15)]'
                            : 'hover:bg-ctp-surface-0',
                        ].join(' ')}
                        aria-pressed={isSelected}
                        aria-label={`${tx.merchant} ${formatAmount(tx.amount)} ${isSelected ? '선택 해제' : '선택'}`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className={[
                              'text-sm truncate',
                              isSelected ? 'text-ctp-mauve font-medium' : 'text-ctp-text',
                            ].join(' ')}
                          >
                            {tx.merchant}
                          </span>
                          <span className="text-xs text-ctp-subtext-1">
                            {tx.date.slice(5).replace('-', '.')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          {isSelected && (
                            <span className="text-ctp-mauve text-xs">✓</span>
                          )}
                          <span
                            className={[
                              'text-sm font-medium whitespace-nowrap',
                              isSelected ? 'text-ctp-mauve' : 'text-ctp-text',
                            ].join(' ')}
                          >
                            {formatAmount(tx.amount)}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
