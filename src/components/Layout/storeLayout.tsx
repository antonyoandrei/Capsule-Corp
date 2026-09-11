import { Suspense, useEffect, useLayoutEffect } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import HeaderNavComponent from "../Header/header-nav"
import { capsuleCorpLogo as capsuleLogo } from "../../services/artwork"
import PageTop from "../PageTop/pageTop"
import RouteSkeleton from "../ui/Skeleton/routeSkeleton"
import { prefetchPage } from "../../Routes/pageImports"
import RouteBoundary from "../../Routes/routeBoundary"
import "./store-layout.css"

const StoreLayout = () => {
  const location = useLocation()

  useEffect(() => {
    const prefetch = (event: Event) => {
      if (event instanceof PointerEvent && event.pointerType === "touch" && event.type === "pointerover") return
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
      if (connection?.saveData || connection?.effectiveType?.includes("2g")) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || link.origin !== window.location.origin || link.pathname === window.location.pathname) return
      if (event instanceof PointerEvent && event.relatedTarget instanceof Node && link.contains(event.relatedTarget)) return
      prefetchPage(link.pathname)
    }
    document.addEventListener("pointerover", prefetch, { passive: true })
    document.addEventListener("pointerdown", prefetch, { passive: true })
    document.addEventListener("focusin", prefetch)
    return () => {
      document.removeEventListener("pointerover", prefetch)
      document.removeEventListener("pointerdown", prefetch)
      document.removeEventListener("focusin", prefetch)
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <HeaderNavComponent />
      <main id="main-content" className="page-view" data-route={location.pathname} tabIndex={-1}>
        <RouteBoundary key={location.pathname}>
        <Suspense fallback={<RouteSkeleton pathname={location.pathname} />}>
          <div key={location.pathname} className="route-content"><Outlet /></div>
        </Suspense>
        </RouteBoundary>
      </main>
      <footer className="store-footer">
        <div className="footer-signature">
          <p className="footer-wordmark">Capsule <span>Corp.</span></p>
          <NavLink className="footer-seal" to="/about" aria-label="About Capsule Corp"><img src={capsuleLogo} alt="" width="120" height="120" /></NavLink>
        </div>
        <div className="footer-bottom">
        <nav aria-label="Footer navigation">
          <NavLink to="/clothes">Clothes</NavLink>
          <NavLink to="/items">Items</NavLink>
          <NavLink to="/wishlist">Wishlist</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        </div>
      </footer>
      <PageTop />
      <Toaster position="bottom-right" toastOptions={{
        duration: 2600,
        style: { background: "var(--clr-black)", color: "var(--clr-white)", border: "1px solid rgba(255, 209, 54, 0.4)", borderRadius: "0.85rem", fontFamily: "var(--font-body)" },
        success: { iconTheme: { primary: "var(--primary-yellow)", secondary: "var(--clr-black)" } },
      }} />
    </>
  )
}

export default StoreLayout
