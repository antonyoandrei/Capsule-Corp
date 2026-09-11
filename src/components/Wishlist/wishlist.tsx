import { NavLink } from "react-router-dom"
import ShenronArtwork from "./ShenronArtwork"
import FrameComponent from "../Frame/frame"
import TabComponent from "../Tab/tab"
import PageHeader from "../ui/PageHeader/pageHeader"
import { DragonRadar } from "../ui/DataState/dataState"
import { useWishlist } from "../WishlistContext/useWishlist"
import { useVisibleMotion } from "../ui/useVisibleMotion"
import "../ui/StoreButton/store-button.css"
import "../Catalog/catalog-view.css"
import "./wishlist.css"

const WishlistComponent = () => {
  const { wishlist } = useWishlist()
  const empty = wishlist.length === 0
  const headerMotionRef = useVisibleMotion<HTMLDivElement>()
  const radarMotionRef = useVisibleMotion<HTMLElement>(empty)

  return (
    <>
      <div ref={headerMotionRef} className="catalog-heading catalog-heading--wishlist">
        <PageHeader title="Wishlist" count={wishlist.length} />
        <div className="catalog-art-window wishlist-art-window" aria-hidden="true">
          <span className="wishlist-atmosphere" />
          <span className="wishlist-dragon"><ShenronArtwork /></span>
        </div>
      </div>
      {empty && (
        <section ref={radarMotionRef} className="wishlist-empty" aria-labelledby="wishlist-empty-title">
          <DragonRadar className="wishlist-radar" />
          <h2 id="wishlist-empty-title">No saved products</h2>
          <p>Tap the Dragon Ball on a product to save it here.</p>
          <div className="wishlist-actions">
            <NavLink to="/clothes" className="store-button store-button--text">Browse clothes</NavLink>
            <NavLink to="/items" className="wishlist-items">Browse items</NavLink>
          </div>
        </section>
      )}
      {!empty && <FrameComponent>{wishlist.map(product => <TabComponent key={product.id} {...product} />)}</FrameComponent>}
    </>
  )
}

export default WishlistComponent
