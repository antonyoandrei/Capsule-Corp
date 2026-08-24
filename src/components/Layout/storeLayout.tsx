import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import HeaderNavComponent from "../Header/header-nav"
import "./store-layout.css"

const StoreLayout = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    document.getElementById("main-content")?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <HeaderNavComponent />
      <main id="main-content" className="page-view" tabIndex={-1}>
        <div key={location.pathname} className="route-content">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2600,
          style: {
            background: "var(--clr-black)",
            color: "var(--clr-white)",
            border: "1px solid rgba(255, 178, 0, 0.55)",
            borderRadius: 0,
            fontFamily: "Oswald, sans-serif",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          },
          success: {
            iconTheme: {
              primary: "var(--primary-yellow)",
              secondary: "var(--clr-black)",
            },
          },
        }}
      />
    </>
  )
}

export default StoreLayout
