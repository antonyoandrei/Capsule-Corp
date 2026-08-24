import { useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import toast from "react-hot-toast"
import { ClothesContext } from "../Fetch/clothes-fetch"
import { ItemsContext } from "../Fetch/items-fetch"
import { useWishlist } from "../WishlistContext/useWishlist"
import { useCart } from "../CartContext/useCart"
import DataState from "../ui/DataState/dataState"
import FadeImage from "../ui/FadeImage/fadeImage"
import "swiper/css"
import "swiper/css/navigation"
import "../ui/Skeleton/skeleton.css"
import "./product-page.css"

const priceFormatter = new Intl.NumberFormat("en-US")

const ProductPageComponent = ({ id }: { id: number }) => {
  const navigate = useNavigate()
  const { clothes, loading: clothesLoading, error: clothesError } = useContext(ClothesContext)
  const { items, loading: itemsLoading, error: itemsError } = useContext(ItemsContext)
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist()
  const { addToCart } = useCart()
  const selectedProduct = useMemo(() => [...clothes, ...items].find(product => product.id === id), [clothes, items, id])
  const loading = clothesLoading || itemsLoading
  const error = clothesError || itemsError
  const isAlreadyInWishlist = selectedProduct ? wishlist.some(item => item.id === selectedProduct.id) : false

  const handleAddToWishlist = () => {
    if (!selectedProduct) return
    if (isAlreadyInWishlist) {
      removeFromWishlist(selectedProduct.id)
      toast("Removed from wishlist")
    } else {
      addToWishlist(selectedProduct)
      toast.success("Saved to wishlist")
    }
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    addToCart(selectedProduct)
    toast.success("Product added to cart")
  }

  return (
    <>
      <button onClick={() => navigate(-1)} className="back" type="button" aria-label="Go back"></button>
      {loading && (
        <div className="product-skeleton" aria-hidden="true">
          <div className="product-skel-media"></div>
          <div className="product-skel-copy">
            <span className="skel-line skel-sm"></span>
            <span className="skel-line skel-lg"></span>
            <span className="skel-line skel-md"></span>
            <span className="skel-line skel-btn"></span>
          </div>
        </div>
      )}
      {!loading && error && (
        <DataState title="Product unavailable" actionLabel="Back home" to="/homepage" variant="error">{error}</DataState>
      )}
      {!loading && !error && !selectedProduct && (
        <DataState title="Product not found" actionLabel="Back home" to="/homepage" variant="missing">This product does not exist in the archive.</DataState>
      )}
      {!loading && !error && selectedProduct && (
        <section className="product-container">
          <section className="product-card" aria-label={`${selectedProduct.name} gallery`}>
            <span className="product-gallery-label">Capsule view / {String(selectedProduct.images.length).padStart(2, "0")}</span>
            <Swiper navigation loop={selectedProduct.images.length > 1} modules={[Navigation]} className="productSwiper">
              {selectedProduct.images.map((image, imageIndex) => (
                <SwiperSlide key={image}>
                  <FadeImage className="product-image" src={image} alt={`${selectedProduct.name}, view ${imageIndex + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
          <section className="product-details">
            <span className="product-reference">CAPSULE CORP. / REF {String(selectedProduct.id).padStart(3, "0")}</span>
            <h1 className="details-title">{selectedProduct.name}</h1>
            <p className="details-description">{selectedProduct.description}</p>
            <div className="product-purchase">
              <p className="details-price" aria-label={`${priceFormatter.format(selectedProduct.price)} yen`}>
                <span>{priceFormatter.format(selectedProduct.price)}</span><small aria-hidden="true">¥</small>
              </p>
              <div className="details-btns">
                <button className="cart-btn" onClick={handleAddToCart} type="button">
                  <span className="cart-rectangle"></span>
                  <span className="cart-btn2">Add to cart</span>
                </button>
                <button className={`fav-btn ${isAlreadyInWishlist ? "is-added" : ""}`} onClick={handleAddToWishlist} type="button" aria-label={isAlreadyInWishlist ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isAlreadyInWishlist}>
                  <span className="fav-rectangle">
                    <span className={isAlreadyInWishlist ? "fav-img-added" : "fav-img"}></span>
                  </span>
                </button>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  )
}

export default ProductPageComponent
