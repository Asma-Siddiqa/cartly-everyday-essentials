import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sends keyboard and screen-reader users to the new route's main content after
 * navigation, while keeping the URL/browser history behaviour intact. A hash
 * (for example /about#rules) scrolls to its section instead of the page top.
 */
export function RouteFocus() {
  const { pathname, hash } = useLocation()
  const previousPathname = useRef(pathname)
  const pathnameChanged = previousPathname.current !== pathname

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    let cancelled = false

    function scrollToTarget() {
      if (cancelled) return
      target?.scrollIntoView({ block: 'start' })
    }

    if (target) {
      window.requestAnimationFrame(scrollToTarget)
      // Web fonts can change the height of headings above the target after the
      // first scroll, so align once more when font loading settles.
      document.fonts?.ready.then(scrollToTarget)
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    // On a fresh page load, leave focus at the top so the skip link is the
    // first Tab stop. SPA route changes move focus into the new main content.
    const main = document.getElementById('main-content')
    if (main && pathnameChanged) {
      main.focus({ preventScroll: true })
    }

    previousPathname.current = pathname

    return () => {
      cancelled = true
    }
  }, [pathname, hash])

  return null
}
