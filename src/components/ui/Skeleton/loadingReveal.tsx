import { type ReactNode, useEffect, useState } from "react"
import "./skeleton.css"

const LoadingReveal = ({ loading, skeleton, children, label = "Loading products" }: {
  loading: boolean
  skeleton: ReactNode
  children: ReactNode
  label?: string
}) => {
  const [showSkeleton, setShowSkeleton] = useState(loading)

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true)
      return
    }
    if (!showSkeleton) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowSkeleton(false)
      return
    }
    // Content is usable immediately; only the outgoing placeholder stays for the crossfade.
    const timeout = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(timeout)
  }, [loading, showSkeleton])

  return (
    <div className="loading-reveal" aria-busy={loading} data-revealing={!loading && showSkeleton}>
      {loading && <span className="sr-only" role="status">{label}</span>}
      {(loading || showSkeleton) && <div className="loading-placeholder" aria-hidden="true">{skeleton}</div>}
      {!loading && <div className="loading-content">{children}</div>}
    </div>
  )
}

export default LoadingReveal
