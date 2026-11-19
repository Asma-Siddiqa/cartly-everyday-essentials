import { AlertCircle, CheckCircle2, Info, PackageX } from 'lucide-react'

const styles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    icon: CheckCircle2,
    label: 'Success',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-950',
    icon: AlertCircle,
    label: 'Error',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-950',
    icon: AlertCircle,
    label: 'Warning',
  },
  info: {
    container: 'border-blue-200 bg-brand-blue-soft text-brand-charcoal',
    icon: Info,
    label: 'Information',
  },
  unavailable: {
    container: 'border-brand-charcoal/15 bg-brand-charcoal/[0.04] text-brand-charcoal',
    icon: PackageX,
    label: 'Unavailable',
  },
}

/**
 * Status feedback always includes an icon and text, not colour alone.
 */
export function StatusMessage({ tone = 'info', children, className = '', dismissible = false, onDismiss }) {
  const style = styles[tone] ?? styles.info
  const Icon = style.icon

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${style.container} ${className}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="sr-only">{style.label}: </span>
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-1.5 py-0.5 text-xs font-semibold underline decoration-current underline-offset-2 opacity-80 hover:opacity-100 focus-visible:outline-none"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}
