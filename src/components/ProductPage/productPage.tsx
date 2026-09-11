import { useContext, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { A11y, Keyboard, Navigation } from "swiper/modules"
import type { Swiper as SwiperInstance } from "swiper"
import toast from "react-hot-toast"
import { productImage, productImageSrcSet } from "../../services/productImage"
import { ClothesContext } from "../Fetch/clothes-context"
import { ItemsContext } from "../Fetch/items-context"
import { useWishlist } from "../WishlistContext/useWishlist"
import { useCartActions } from "../CartContext/useCart"
import DataState from "../ui/DataState/dataState"
import FadeImage from "../ui/FadeImage/fadeImage"
import StoreIcon from "../ui/StoreIcon/storeIcon"
import { useAddedFeedback } from "../ui/StoreButton/useAddedFeedback"
import LoadingReveal from "../ui/Skeleton/loadingReveal"
import { ProductSkeleton } from "../ui/Skeleton/skeleton"
import "../ui/StoreButton/store-button.css"
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
  const { addToCart } = useCartActions()
  const { addedCount, confirmAdded } = useAddedFeedback(id)
  const gallery = useRef<SwiperInstance | null>(null)
  const thumbnailRail = useRef<HTMLDivElement>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const products = useMemo(() => [...clothes, ...items], [clothes, items])
  const selectedProduct = useMemo(() => products.find(product => product.id === id), [products, id])
  const productStyles = useMemo(() => selectedProduct?.style
    ? products.filter(product => product.style?.group === selectedProduct.style?.group)
    : [], [products, selectedProduct])
  const galleryImages = useMemo(() => {
    if (!selectedProduct) return []
    const images = [...new Set(selectedProduct.images.map(image => image.trim()).filter(Boolean))]
    return images.length ? images : [selectedProduct.img]
  }, [selectedProduct])
  const hasMultipleImages = galleryImages.length > 1
  const loading = !selectedProduct && (clothesLoading || itemsLoading)
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
    confirmAdded()
  }

  return (
    <>
      <div className="product-back-row">
        <button onClick={() => navigate(-1)} className="back" type="button">
          <span className="store-button-icon"><StoreIcon name="arrow" /></span>
          Back
        </button>
      </div>
      <LoadingReveal loading={loading} skeleton={<ProductSkeleton />} label="Loading product">
      {!selectedProduct && error && (
        <DataState title="Product unavailable" actionLabel="Back home" to="/homepage" variant="error">{error}</DataState>
      )}
      {!error && !selectedProduct && (
        <DataState title="Product not found" actionLabel="Back home" to="/homepage" variant="missing">This product is not available in the catalog.</DataState>
      )}
      {selectedProduct && (
        <section className="product-container" aria-label={selectedProduct.name}>
          <section className="product-card" aria-label={`${selectedProduct.name} gallery`}>
            <div className="product-display-art" aria-hidden="true" />
            <Swiper
              key={selectedProduct.id}
              navigation={hasMultipleImages ? { prevEl: ".product-gallery-prev", nextEl: ".product-gallery-next", addIcons: false } : false}
              a11y={{ prevSlideMessage: "Previous image", nextSlideMessage: "Next image" }}
              loop={hasMultipleImages}
              keyboard={{ enabled: hasMultipleImages, onlyInViewport: true }}
              allowTouchMove={hasMultipleImages}
              speed={500}
              modules={[A11y, Keyboard, Navigation]}
              className="productSwiper"
              onSwiper={swiper => { gallery.current = swiper; setActiveImageIndex(0) }}
              onSlideChange={swiper => {
                setActiveImageIndex(swiper.realIndex)
                const rail = thumbnailRail.current
                const thumbnail = rail?.children[swiper.realIndex] as HTMLElement | undefined
                if (rail && thumbnail) rail.scrollTo({ left: thumbnail.offsetLeft - (rail.clientWidth - thumbnail.clientWidth) / 2 })
              }}
            >
              {galleryImages.map((image, imageIndex) => (
                <SwiperSlide key={`${image}-${imageIndex}`}>
                  <FadeImage
                    className="product-image"
                    src={productImage(image, 1200)}
                    srcSet={productImageSrcSet(image, [560, 840, 1200, 1600])}
                    sizes="(max-width: 864px) 80vw, (max-width: 1400px) 42vw, 590px"
                    width={840}
                    height={840}
                    alt={hasMultipleImages ? `${selectedProduct.name}, view ${imageIndex + 1}` : selectedProduct.name}
                    loading={imageIndex === 0 ? "eager" : "lazy"}
                    fetchPriority={imageIndex === 0 ? "high" : "low"}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {hasMultipleImages && (
              <div className="product-gallery-controls">
                <button className="product-gallery-arrow product-gallery-prev" type="button" aria-label="Previous image" />
                <div className="product-thumbnails" ref={thumbnailRail} role="group" aria-label="Product views">
                  {galleryImages.map((image, imageIndex) => (
                    <button
                      className="product-thumbnail"
                      key={`${image}-${imageIndex}`}
                      type="button"
                      aria-label={`Show ${selectedProduct.name}, view ${imageIndex + 1}`}
                      aria-pressed={activeImageIndex === imageIndex}
                      onClick={() => gallery.current?.slideToLoop(imageIndex)}
                    >
                      <img src={productImage(image, 160)} alt="" width="68" height="68" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
                <button className="product-gallery-arrow product-gallery-next" type="button" aria-label="Next image" />
              </div>
            )}
          </section>
          <section className="product-details">
            <h1 className="details-title">{selectedProduct.name}</h1>
            {productStyles.length > 1 && (
              <nav className="product-styles" aria-labelledby="product-style-label">
                <span className="product-style-label" id="product-style-label">{productStyles.every(product => product.style?.color) ? "Color" : "Style"}</span>
                <div className="product-style-options">
                  {productStyles.map(product => (
                    <Link
                      className="product-style-link"
                      key={product.id}
                      to={`/product-page/${product.id}`}
                      aria-current={product.id === id ? "page" : undefined}
                    >
                      {product.style?.color && <span className="product-style-swatch" style={{ backgroundColor: product.style.color }} aria-hidden="true" />}
                      {product.style?.label || product.name}
                    </Link>
                  ))}
                </div>
              </nav>
            )}
            <div className="product-purchase">
              <p className="details-price" aria-label={`${priceFormatter.format(selectedProduct.price)} yen`}>
                <span>{priceFormatter.format(selectedProduct.price)}</span><small aria-hidden="true">¥</small>
              </p>
              <div className="details-btns">
                <button className="cart-btn store-button store-button--dark" onClick={handleAddToCart} type="button" aria-label={`Add ${selectedProduct.name} to bag`} data-added={addedCount > 0}>
                  <span className="store-button-label" aria-hidden="true"><span>Add to bag</span><span>Added</span></span>
                  <span className="store-button-icon store-button-confirmation" aria-hidden="true"><StoreIcon name="bag" /><span className="store-button-check" /></span>
                </button>
                <button className={`fav-btn ${isAlreadyInWishlist ? "is-added" : ""}`} onClick={handleAddToWishlist} type="button" aria-label={isAlreadyInWishlist ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isAlreadyInWishlist}>
                  <span className={isAlreadyInWishlist ? "fav-img-added" : "fav-img"} aria-hidden="true"></span>
                </button>
              </div>
              <span className="sr-only" role="status">{addedCount > 0 ? `${selectedProduct.name} added to bag${addedCount > 1 ? `, ${addedCount} added` : ""}` : ""}</span>
            </div>
            <p className="details-description">{selectedProduct.description}</p>
          </section>
        </section>
      )}
      </LoadingReveal>
    </>
  )
}

export default ProductPageComponent
