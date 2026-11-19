import { Outlet } from 'react-router-dom'
import { Header } from './Header.jsx'
import { Footer } from './Footer.jsx'
import { RouteFocus } from './RouteFocus.jsx'
import { CompareBar } from '../compare/CompareBar.jsx'

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-brand-charcoal focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>
      <RouteFocus />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children ?? <Outlet />}
      </main>
      <CompareBar />
      <Footer />
    </div>
  )
}
