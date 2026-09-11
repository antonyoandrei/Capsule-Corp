import { useContext, useMemo } from "react"
import { NavLink } from "react-router-dom"
import { ClothesContext } from "../Fetch/clothes-context"
import { ItemsContext } from "../Fetch/items-context"
import TabComponent from "../Tab/tab"
import CatalogSkeleton from "../ui/Skeleton/skeleton"
import LoadingReveal from "../ui/Skeleton/loadingReveal"
import "./featured-rail.css"

const FeaturedRail = () => {
  const { clothes, loading: clothesLoading, error: clothesError } = useContext(ClothesContext)
  const { items, loading: itemsLoading, error: itemsError } = useContext(ItemsContext)
  const featured = useMemo(() => [...clothes, ...items].filter(product => product.mostBuyed).slice(0, 6), [clothes, items])
  const loading = clothesLoading || itemsLoading

  return (
    <div className="featured-rail">
      <section className="featured-products" aria-labelledby="featured-title">
        <header className="featured-rail-head">
          <h2 id="featured-title">Most wanted</h2>
          <NavLink className="featured-view-all" to="/most-buyed">View all</NavLink>
        </header>
        <LoadingReveal loading={loading && featured.length === 0} skeleton={<div className="featured-track"><CatalogSkeleton count={6} /></div>}>
          <div className="featured-track">
            {featured.map(product => <TabComponent key={product.id} {...product} featured />)}
          </div>
        </LoadingReveal>
        {!loading && featured.length === 0 && (
          <p className="home-catalog-state" role="status">{clothesError || itemsError ? "Products are temporarily unavailable. Please try again later." : "No products available."}</p>
        )}
      </section>
    </div>
  )
}

export default FeaturedRail
