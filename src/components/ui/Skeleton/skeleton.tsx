import { FC } from "react"
import "./skeleton.css"

const CatalogSkeleton: FC<{ count?: number }> = ({ count = 10 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="tab tab-skeleton"
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export default CatalogSkeleton
