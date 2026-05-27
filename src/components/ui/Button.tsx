import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-ctp-mauve text-ctp-crust hover:bg-ctp-pink active:scale-[0.97] disabled:opacity-40',
  secondary:
    'bg-ctp-surface-1 text-ctp-text border border-ctp-surface-2 hover:bg-ctp-surface-2 disabled:opacity-40',
  ghost:
    'bg-transparent text-ctp-text border border-ctp-overlay-0 hover:bg-ctp-surface-0 disabled:opacity-40',
};

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'h-10 px-5 rounded-[8px]',
        'text-sm font-semibold tracking-wide',
        'transition-all duration-100',
        'focus-visible:outline-2 focus-visible:outline-ctp-lavender focus-visible:outline-offset-2',
        'disabled:pointer-events-none cursor-pointer',
        variantStyles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
