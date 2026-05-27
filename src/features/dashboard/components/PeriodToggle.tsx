'use client';

import type { PeriodMode } from '@/types';

interface PeriodToggleProps {
  mode: PeriodMode;
  onChange: (mode: PeriodMode) => void;
}

export default function PeriodToggle({ mode, onChange }: PeriodToggleProps) {
  return (
    <div className="flex gap-1 bg-ctp-surface-0 rounded-[8px] p-1 border border-ctp-surface-1">
      {(['monthly', 'yearly'] as PeriodMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={[
            'flex-1 px-4 py-1.5 rounded-[6px] text-sm font-medium transition-colors duration-150',
            mode === m
              ? 'bg-ctp-mauve text-ctp-crust'
              : 'text-ctp-subtext-1 hover:text-ctp-text',
          ].join(' ')}
        >
          {m === 'monthly' ? '월간' : '연간'}
        </button>
      ))}
    </div>
  );
}
