import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-ctp-peach text-ctp-crust hover:opacity-90 active:scale-[0.97] disabled:opacity-40',
  secondary:
    'bg-ctp-mauve text-ctp-crust hover:opacity-90 active:scale-[0.97] disabled:opacity-40',
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
