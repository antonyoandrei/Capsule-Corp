import { FC } from "react"
import "./page-header.css"

interface PageHeaderProps {
  kicker: string
  title: string
  count?: number
  countLabel?: string
}

const PageHeader: FC<PageHeaderProps> = ({ kicker, title, count, countLabel = "products" }) => {
  const resolvedCountLabel = typeof count === "number" && count === 1 ? countLabel.replace(/s$/, "") : countLabel

  return (
    <header className="page-header">
      <div>
        <p className="page-kicker">{kicker}</p>
        <h1>{title}</h1>
      </div>
      {typeof count === "number" ? (
        <p className="page-count" aria-label={`${count} ${resolvedCountLabel}`}>
          <strong aria-hidden="true">{count}</strong>
          <span aria-hidden="true">{resolvedCountLabel}</span>
        </p>
      ) : (
        <span className="page-count-skel" aria-hidden="true"></span>
      )}
    </header>
  )
}

export default PageHeader
