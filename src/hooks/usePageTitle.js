import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Cartly` : 'Cartly — Everyday essentials, delivered'
  }, [title])
}
