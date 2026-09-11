import { useEffect, useState } from "react"
import "./page-top.css"

const PageTop = () => {
  const [showPageTop, setShowPageTop] = useState(false)

  useEffect(() => {
    let previous = window.scrollY > 200
    setShowPageTop(previous)
    const handleScroll = () => {
      const visible = window.scrollY > 200
      if (visible !== previous) { previous = visible; setShowPageTop(visible) }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    })
    document.querySelector<HTMLAnchorElement>(".store-header-brand")?.focus({ preventScroll: true })
  }

  return (
    <button className={`page-top ${showPageTop ? "shown" : "hidden"}`} onClick={scrollToTop} type="button" aria-label="Back to page top" title="Back to page top" />
  )
}

export default PageTop
