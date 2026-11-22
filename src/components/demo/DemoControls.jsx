import { FlaskConical, RotateCcw, TriangleAlert } from 'lucide-react'
import { AVAILABILITY_SCENARIOS } from '../../config/demo.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { StatusMessage } from '../ui/StatusMessage.jsx'

export function DemoControls() {
  const {
    demo,
    status,
    setAvailabilityScenario,
    setEmptyCatalogue,
    simulateLoadFailure,
    resetDemo,
    retry,
  } = useCatalog()

  const isCustom = demo.scenario !== 'standard' || demo.emptyCatalogue

  return (
    <details className="group rounded-2xl border border-dashed border-brand-charcoal/25 bg-white/70 open:bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-brand-charcoal focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-sun/30 text-brand-charcoal">
          <FlaskConical aria-hidden="true" className="h-4 w-4" />
        </span>
        <span className="flex-1">
          Test settings
          <span className="block text-xs font-medium text-brand-charcoal/55">
            Loading failure, catalogue emptiness, and stock availability
          </span>
        </span>
        <span className="rounded-full bg-brand-blue-soft px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-brand-navy">
          Tests
        </span>
      </summary>

      <div className="border-t border-brand-charcoal/10 px-4 pb-4 pt-4">
        <p className="text-xs leading-relaxed text-brand-charcoal/60">
          Preview how the shop handles loading, empty-catalogue, and stock states. Trigger a failure, then use
          the catalogue's <strong>Retry</strong> button to recover.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="demo-availability" className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/60">
              Product availability
            </label>
            <select
              id="demo-availability"
              value={demo.scenario}
              onChange={(event) => setAvailabilityScenario(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium text-brand-charcoal outline-none focus:border-brand-blue-strong focus:ring-4 focus:ring-brand-blue/30"
            >
              {AVAILABILITY_SCENARIOS.map((scenario) => (
                <option key={scenario.value} value={scenario.value}>
                  {scenario.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-brand-charcoal/55">
              {AVAILABILITY_SCENARIOS.find((scenario) => scenario.value === demo.scenario)?.description}
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-charcoal/60">Catalogue size</span>
            <label htmlFor="demo-empty" className="mt-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-brand-charcoal/15 bg-white px-3 text-sm font-medium">
              <input
                id="demo-empty"
                type="checkbox"
                checked={demo.emptyCatalogue}
                onChange={(event) => setEmptyCatalogue(event.target.checked)}
                className="h-4 w-4 rounded border-brand-charcoal/30 text-brand-navy focus:ring-brand-blue"
              />
              Simulate an empty catalogue
            </label>
            <p className="mt-1.5 text-xs text-brand-charcoal/55">
              Shows the difference between no products and no search matches.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={simulateLoadFailure}
            disabled={status === 'loading'}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 text-xs font-bold text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TriangleAlert aria-hidden="true" className="h-4 w-4" />
            Simulate load failure (next request)
          </button>
          {status === 'error' && (
            <button
              type="button"
              onClick={retry}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-charcoal px-3 text-xs font-bold text-white transition hover:bg-brand-ink"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Retry catalogue
            </button>
          )}
          {isCustom && (
            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-charcoal/15 bg-white px-3 text-xs font-bold text-brand-charcoal transition hover:border-brand-charcoal/30"
            >
              Reset test settings
            </button>
          )}
        </div>

        {status === 'error' && (
          <StatusMessage tone="warning" className="mt-3">
            The last request was deliberately failed. Choose <strong>Retry catalogue</strong> or the Retry
            button in the results area to load the products again.
          </StatusMessage>
        )}
      </div>
    </details>
  )
}
