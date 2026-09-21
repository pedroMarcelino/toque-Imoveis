import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-border bg-card text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }