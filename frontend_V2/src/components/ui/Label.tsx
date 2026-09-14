import { forwardRef } from 'react'
import type { LabelHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground', className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }