import { Link } from 'react-router-dom'
import { ArrowUpRight, Instagram, Mail, MapPin, ShieldCheck } from 'lucide-react'
import { Logo } from '../ui/Logo.jsx'
import { useCompare } from '../../context/CompareContext.jsx'

export function Footer() {
  const { ids: compareIds } = useCompare()

  return (
    <footer className={`mt-16 bg-brand-charcoal text-white ${compareIds.length > 0 ? 'pb-24' : ''}`}>
      <div className="container-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
              Considered everyday essentials for students and young professionals — delivered across
              Islamabad and Rawalpindi with clear prices and no surprise fees.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-4 w-4 text-brand-blue" />
                Islamabad &amp; Rawalpindi
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand-blue" />
                Cash on delivery
              </span>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="inline-flex items-center gap-1.5 text-white/75 transition hover:text-white">
                  Shop all products <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/75 transition hover:text-white">
                  Business profile
                </Link>
              </li>
              <li>
                <Link to="/about#rules" className="text-white/75 transition hover:text-white">
                  Stock &amp; delivery rules
                </Link>
              </li>
              <li>
                <Link to="/about#rules" className="text-white/75 transition hover:text-white">
                  Supported delivery areas
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Say hello</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Questions about an order or a delivery area? Get in touch and we'll be happy to help.
            </p>
            <a
              href="mailto:hello@cartly.example"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:text-white"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              hello@cartly.example
            </a>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-white/45">
              <Instagram aria-hidden="true" className="h-4 w-4" />
              @cartly.pk
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cartly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
