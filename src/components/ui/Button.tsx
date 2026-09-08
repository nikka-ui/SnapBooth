import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-booth-crimson text-white shadow-[0_12px_28px_rgb(180_35_24_/0.28)] hover:bg-booth-crimson-deep active:translate-y-px',
  secondary:
    'bg-booth-ink text-booth-cream shadow-[0_10px_24px_rgb(26_18_16_/0.18)] hover:bg-black active:translate-y-px',
  ghost:
    'bg-white/70 text-booth-ink ring-1 ring-booth-ink/10 hover:bg-white active:translate-y-px',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-semibold tracking-tight transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
