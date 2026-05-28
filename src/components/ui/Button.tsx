import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  // Peach → Pink  (warm CTA)
  primary:
    'bg-gradient-to-r from-ctp-peach to-ctp-pink text-ctp-on-accent ' +
    'hover:opacity-90 active:scale-[0.97] disabled:opacity-40',
  // Mauve → Lavender  (cool navigation)
  secondary:
    'bg-gradient-to-r from-ctp-mauve to-ctp-lavender text-ctp-on-accent ' +
    'hover:opacity-90 active:scale-[0.97] disabled:opacity-40',
  // Ghost: border only, no fill
  ghost:
    'bg-transparent text-ctp-text border border-ctp-overlay-0 ' +
    'hover:bg-ctp-surface-0 disabled:opacity-40',
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
        'h-10 px-5 rounded-full',          // pill shape
        'text-sm font-semibold tracking-wide',
        'transition-all duration-150',
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
