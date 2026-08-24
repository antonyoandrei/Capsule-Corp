import { FC, ReactNode } from "react"
import { NavLink } from "react-router-dom"
import "./data-state.css"

interface DataStateProps {
  title: string
  children: ReactNode
  actionLabel?: string
  onAction?: () => void
  to?: string
  variant?: "empty" | "error" | "missing"
}

const stateLabels = {
  empty: "Dragon Radar / no signal",
  error: "Dragon Radar / signal lost",
  missing: "Dragon Radar / timeline missing",
}

const DataState: FC<DataStateProps> = ({ title, children, actionLabel, onAction, to, variant = "empty" }) => {
  return (
    <section className={`data-state data-state-${variant}`} role={variant === "error" ? "alert" : "status"}>
      <div className="data-state-card">
        <div className="data-state-visual" aria-hidden="true">
          <span className="data-state-radar">
            <span className="data-state-ball">
              <span className="data-state-stars"><i>★</i><i>★</i><i>★</i><i>★</i></span>
            </span>
          </span>
        </div>
        <div className="data-state-copy">
          <span className="data-state-kicker">{stateLabels[variant]}</span>
          <h2>{title}</h2>
          <p>{children}</p>
          {to && actionLabel ? (
            <NavLink className="data-state-action" to={to}>{actionLabel}<span aria-hidden="true">→</span></NavLink>
          ) : null}
          {onAction && actionLabel ? (
            <button type="button" className="data-state-action" onClick={onAction}>{actionLabel}<span aria-hidden="true">↻</span></button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default DataState
