import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-ctp-mantle border-b border-ctp-surface-0 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-ctp-mauve font-bold text-lg">💳</span>
        <span className="text-ctp-text font-semibold text-base tracking-tight">
          카드 가계부
        </span>
      </Link>
      <ThemeToggle />
    </header>
  );
}
