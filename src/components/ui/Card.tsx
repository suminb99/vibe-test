import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export default function Card({ interactive = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-ctp-surface-0 border border-ctp-surface-1 rounded-[12px] p-6',
        interactive
          ? 'cursor-pointer hover:bg-ctp-surface-1 hover:shadow-md transition-all duration-200'
          : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
