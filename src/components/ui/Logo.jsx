import { Link } from 'react-router-dom'

export function Logo({ className = '', compact = false }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none ${className}`}
      aria-label="Cartly home"
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-brand-charcoal text-brand-blue shadow-card transition-transform group-hover:-rotate-3">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6">
          <path d="M8 12.5h16l-1.4 12.1a2 2 0 0 1-2 1.8H11.4a2 2 0 0 1-2-1.8L8 12.5Z" fill="currentColor" />
          <path d="M12 13V10a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="16" cy="19.2" r="2.2" fill="#2A2D34" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[1.7rem] font-semibold leading-none tracking-tight text-brand-charcoal">
          cartly<span className="text-brand-blue-strong">.</span>
        </span>
      )}
    </Link>
  )
}
