import { cn } from '../../utils/cn.js'

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-charcoal-100 text-charcoal-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    rosa: 'bg-rosa-100 text-rosa-700',
    info: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body', variants[variant], className)}>
      {children}
    </span>
  )
}
