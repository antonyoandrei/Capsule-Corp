import { useEffect, useRef } from "react"

export const useVisibleMotion = <T extends HTMLElement>(enabled = true) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return
    let inView = true
    const update = () => element.classList.toggle("motion-paused", !inView || document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    }, { rootMargin: "80px" })
    observer.observe(element)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
      element.classList.remove("motion-paused")
    }
  }, [enabled])

  return ref
}
