import type { Category } from '@/types';

interface BadgeProps {
  label: string;
  category?: Category;
  variant?: 'cancel' | 'default';
}

const categoryStyles: Partial<Record<Category, string>> = {
  식비:         'bg-[rgba(245,169,127,0.15)] text-ctp-peach',
  카페:         'bg-[rgba(138,173,244,0.15)] text-ctp-blue',
  쇼핑:         'bg-[rgba(198,160,246,0.15)] text-ctp-mauve',
  교통:         'bg-[rgba(139,213,202,0.15)] text-ctp-teal',
  구독서비스:   'bg-[rgba(166,218,149,0.15)] text-ctp-green',
  '뷰티/헬스':  'bg-[rgba(245,189,230,0.15)] text-ctp-pink',
  엔터테인먼트: 'bg-[rgba(145,215,227,0.15)] text-ctp-sky',
  의료:         'bg-[rgba(237,135,150,0.15)] text-ctp-red',
  교육:         'bg-[rgba(238,212,159,0.15)] text-ctp-yellow',
  여행:         'bg-[rgba(125,196,228,0.15)] text-ctp-sapphire',
  기타:         'bg-ctp-surface-1 text-ctp-subtext-1',
};

export default function Badge({ label, category, variant }: BadgeProps) {
  const style =
    variant === 'cancel'
      ? 'bg-[rgba(237,135,150,0.15)] text-ctp-red'
      : category
      ? (categoryStyles[category] ?? 'bg-ctp-surface-1 text-ctp-subtext-1')
      : 'bg-ctp-surface-1 text-ctp-subtext-1';

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full',
        'text-[11px] font-medium tracking-wide',
        style,
      ].join(' ')}
    >
      {label}
    </span>
  );
}
