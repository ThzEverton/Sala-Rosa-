import { cn } from '../../utils/cn.js'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-xl shadow-2xl w-full overflow-hidden', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-100">
            <h2 className="text-lg font-heading font-semibold text-charcoal-900">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-charcoal-50 text-charcoal-400 hover:text-charcoal-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
