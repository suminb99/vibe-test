'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 서버 렌더링 시 hydration mismatch 방지
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-[8px] bg-ctp-surface-0 border border-ctp-surface-1" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="w-9 h-9 flex items-center justify-center rounded-[8px]
                 bg-ctp-surface-0 border border-ctp-surface-1
                 text-ctp-subtext-1 hover:text-ctp-mauve hover:bg-ctp-surface-1
                 transition-colors duration-150
                 focus-visible:outline-2 focus-visible:outline-ctp-lavender focus-visible:outline-offset-2"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
