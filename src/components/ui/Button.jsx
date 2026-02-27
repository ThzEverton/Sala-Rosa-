import { cn } from '../../utils/cn.js'

const variants = {
  primary: 'bg-rosa-600 text-white hover:bg-rosa-700 shadow-sm',
  secondary: 'bg-cream-200 text-charcoal-800 hover:bg-cream-300',
  outline: 'border-2 border-rosa-300 text-rosa-700 hover:bg-rosa-50',
  ghost: 'text-charcoal-600 hover:bg-charcoal-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  whatsapp: 'bg-green-500 text-white hover:bg-green-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-body font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rosa-300 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
