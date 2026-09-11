import { FC } from "react"
import "./skeleton.css"

const CatalogSkeleton: FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="tab tab-skeleton"
          aria-hidden="true"
        >
          <div className="tab-media skeleton-surface" />
          <div className="tab-meta">
            <span className="tab-name"><span className="skel-line" /><span className="skel-line skel-short" /></span>
            <div className="tab-purchase">
              <span className="tab-price"><span className="skel-line skel-price" /></span>
              <span className="skel-line skel-card-button" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export const ProductSkeleton = () => (
  <div className="product-skeleton" aria-hidden="true">
    <div className="product-skel-gallery">
      <div className="product-skel-media skeleton-surface" />
      <div className="product-skel-thumbnails"><i className="skeleton-surface" /><i className="skeleton-surface" /><i className="skeleton-surface" /></div>
    </div>
    <div className="product-skel-copy">
      <span className="skel-line skel-lg" />
      <span className="skel-line skel-price" />
      <span className="skel-line skel-btn" />
      <span className="skel-line" /><span className="skel-line" /><span className="skel-line skel-short" />
    </div>
  </div>
)

export default CatalogSkeleton
