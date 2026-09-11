import { FC, ReactNode } from "react"
import { NavLink } from "react-router-dom"
import "../StoreButton/store-button.css"
import "./data-state.css"

interface DataStateProps {
  title: string
  children: ReactNode
  actionLabel?: string
  onAction?: () => void
  to?: string
  variant?: "empty" | "error" | "missing"
}

export const DragonRadar = ({ className = "", searching = true }: { className?: string; searching?: boolean }) => (
  <div className={`data-state-visual ${className}`} aria-hidden="true">
    <span className="data-state-radar">
      {searching ? (
        <>
          <span className="data-state-radar-sweep" />
          <span className="data-state-signal" />
        </>
      ) : <span className="data-state-radar-mark" />}
    </span>
  </div>
)

const DataState: FC<DataStateProps> = ({ title, children, actionLabel, onAction, to, variant = "empty" }) => {
  return (
    <section className={`data-state data-state-${variant}`} role={variant === "error" ? "alert" : "status"}>
      <div className="data-state-card">
        <DragonRadar searching={variant === "empty"} />
        <div className="data-state-copy">
          <h2>{title}</h2>
          <p>{children}</p>
          {to && actionLabel ? (
            <NavLink className="data-state-action store-button store-button--text" to={to}>{actionLabel}</NavLink>
          ) : null}
          {onAction && actionLabel ? (
            <button type="button" className="data-state-action store-button store-button--text" onClick={onAction}>{actionLabel}</button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default DataState
