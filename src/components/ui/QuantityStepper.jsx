import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  value,
  max,
  min = 1,
  onChange,
  disabled = false,
  label = 'Quantity',
  size = 'md',
}) {
  const decreaseDisabled = disabled || value <= min
  const increaseDisabled = disabled || value >= max
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

  return (
    <div className="inline-flex items-center rounded-xl border border-brand-charcoal/15 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={decreaseDisabled}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={`${buttonSize} inline-flex items-center justify-center rounded-lg text-brand-charcoal transition hover:bg-brand-blue-soft disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Minus aria-hidden="true" className="h-4 w-4" />
      </button>
      <span
        className="min-w-9 px-1 text-center text-sm font-bold tabular-nums text-brand-charcoal"
        aria-live="polite"
        aria-label={`${label}: ${value}`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={increaseDisabled}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={`${buttonSize} inline-flex items-center justify-center rounded-lg text-brand-charcoal transition hover:bg-brand-blue-soft disabled:cursor-not-allowed disabled:opacity-35`}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  )
}
