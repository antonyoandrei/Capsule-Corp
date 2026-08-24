import { useContext, useMemo } from "react"
import { NavLink } from "react-router-dom"
import { ClothesContext } from "../Fetch/clothes-fetch"
import { ItemsContext } from "../Fetch/items-fetch"
import TabComponent from "../Tab/tab"
import CatalogSkeleton from "../ui/Skeleton/skeleton"
import "./featured-rail.css"

const FeaturedRail = () => {
  const { clothes, loading: clothesLoading } = useContext(ClothesContext)
  const { items, loading: itemsLoading } = useContext(ItemsContext)
  const featured = useMemo(
    () => [...clothes, ...items].filter(product => product.mostBuyed).slice(0, 8),
    [clothes, items]
  )
  const loading = clothesLoading || itemsLoading

  if (!loading && featured.length === 0) return null

  return (
    <section className="featured-rail" aria-labelledby="featured-title">
      <header className="featured-rail-head">
        <div>
          <p>Field favorites</p>
          <h2 id="featured-title">Most wanted</h2>
        </div>
        <NavLink className="featured-view-all" to="/most-buyed" aria-label="View all products">
          <span className="featured-view-all-icon" aria-hidden="true">↗</span>
        </NavLink>
      </header>
      <div className="featured-track">
        {loading && <CatalogSkeleton count={8} />}
        {!loading && featured.map(product => (
          <TabComponent key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedRail
