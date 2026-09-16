import { useEffect } from 'react'
import { useLocation } from 'wouter'

export default function ScrollToTop() {
  const [location] = useLocation()

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const el = document.querySelector(hash)
      if (el) return
    }
    window.scrollTo(0, 0)
  }, [location])

  return null
}