import { FC } from "react"
import { NavLink } from "react-router-dom"
import toast from "react-hot-toast"
import { clProduct } from "../../types/interface"
import { productImage, productImageSrcSet } from "../../services/productImage"
import { useCartActions } from "../CartContext/useCart"
import { useWishlist } from "../WishlistContext/useWishlist"
import FadeImage from "../ui/FadeImage/fadeImage"
import StoreIcon from "../ui/StoreIcon/storeIcon"
import { useAddedFeedback } from "../ui/StoreButton/useAddedFeedback"
import "../ui/StoreButton/store-button.css"
import "./tab.css"

const priceFormatter = new Intl.NumberFormat("en-US")

const TabComponent: FC<clProduct & { priority?: boolean; featured?: boolean }> = ({ priority = false, featured = false, ...product }) => {
  const { id, name, img, images, price } = product
  const { addToCart } = useCartActions()
  const { addedCount, confirmAdded } = useAddedFeedback(id)
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const saved = wishlist.some(item => item.id === id)

  const toggleWishlist = () => {
    if (saved) removeFromWishlist(id)
    else addToWishlist(product)
    toast(saved ? "Removed from wishlist" : "Saved to wishlist")
  }

  return (
    <article className="tab">
      <NavLink className="tab-media" to={"/product-page/" + id} aria-label={"View " + name}>
        <FadeImage
          src={productImage(images?.[0] || img, 560)}
          srcSet={productImageSrcSet(images?.[0] || img, [320, 560, 840])}
          sizes={featured ? "(max-width: 600px) 44vw, (max-width: 1024px) 29vw, 200px" : "(max-width: 672px) 44vw, (max-width: 1024px) 29vw, (max-width: 1400px) 22vw, 305px"}
          alt={name}
          width={560}
          height={588}
          loading={priority ? "eager" : "lazy"}
        />
      </NavLink>
      <button className="tab-wishlist" type="button" aria-label={(saved ? "Remove " : "Save ") + name + (saved ? " from wishlist" : " to wishlist")} aria-pressed={saved} onClick={toggleWishlist}>
        <StoreIcon name="dragonball" filled={saved} />
      </button>
      <div className="tab-meta">
        <NavLink className="tab-name" to={"/product-page/" + id}>{name}</NavLink>
        <div className="tab-purchase">
          {Number.isFinite(price) && <span className="tab-price" aria-label={priceFormatter.format(price) + " yen"}>{priceFormatter.format(price)}<small aria-hidden="true">&#165;</small></span>}
          <button className="tab-add store-button store-button--dark store-button--compact" type="button" aria-label={"Add " + name + " to bag"} data-added={addedCount > 0} onClick={() => { addToCart(product); confirmAdded() }}>
            <span className="store-button-label" aria-hidden="true"><span>Add to bag</span><span>Added</span></span>
            <span className="store-button-icon store-button-confirmation" aria-hidden="true"><StoreIcon name="bag" /><span className="store-button-check" /></span>
          </button>
          <span className="sr-only" role="status">{addedCount > 0 ? `${name} added to bag${addedCount > 1 ? `, ${addedCount} added` : ""}` : ""}</span>
        </div>
      </div>
    </article>
  )
}

export default TabComponent
