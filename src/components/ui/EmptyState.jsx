import { PackageOpen } from 'lucide-react'

export function EmptyState({
  icon: Icon = PackageOpen,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}) {
  return (
    <div className={`rounded-3xl border border-dashed border-brand-charcoal/20 bg-white px-6 py-12 text-center sm:px-10 ${className}`}>
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-blue-soft text-brand-navy">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      {eyebrow && <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-strong">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-2xl font-semibold text-brand-charcoal">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-brand-charcoal/65">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
