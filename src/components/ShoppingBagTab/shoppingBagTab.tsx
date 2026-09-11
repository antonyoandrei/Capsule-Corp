import { useRef } from "react"
import { NavLink } from "react-router-dom"
import { productImage, productImageSrcSet } from "../../services/productImage"
import { CartItem, useCartActions } from "../CartContext/useCart"
import FadeImage from "../ui/FadeImage/fadeImage"

const priceFormatter = new Intl.NumberFormat("en-US")

const ShoppingBagTabComponent = (product: CartItem) => {
  const { id, name, img, images, price, quantity } = product
  const { addToCart, removeFromCart, decrementFromCart } = useCartActions()
  const rowRef = useRef<HTMLElement>(null)

  const removeProduct = () => {
    const row = rowRef.current
    const nextFocus = row?.nextElementSibling?.querySelector<HTMLButtonElement>(".remove-product")
      ?? row?.previousElementSibling?.querySelector<HTMLButtonElement>(".remove-product")
      ?? row?.closest(".shopping-container")?.querySelector<HTMLHeadingElement>("h1")

    if (row && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof row.animate === "function") {
      const { top, left, width, height } = row.getBoundingClientRect()
      const ghost = row.cloneNode(true) as HTMLElement
      ghost.classList.add("is-removing")
      ghost.setAttribute("aria-hidden", "true")
      ghost.inert = true
      Object.assign(ghost.style, { position: "fixed", top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` })
      document.body.append(ghost)
      const animation = ghost.animate([
        { opacity: 1, transform: "translateX(0) scale(1)" },
        { opacity: 0, transform: "translateX(24px) scale(.97)" },
      ], { duration: 240, easing: "cubic-bezier(.2,.7,.2,1)" })
      animation.onfinish = animation.oncancel = () => ghost.remove()
    }

    removeFromCart(id)
    window.requestAnimationFrame(() => nextFocus?.focus({ preventScroll: true }))
  }

  return (
    <article className="bag-product" ref={rowRef}>
      <NavLink className="bag-product-image" to={`/product-page/${id}`} aria-label={`View ${name}`}>
        <FadeImage src={productImage(images?.[0] || img, 560)} srcSet={productImageSrcSet(images?.[0] || img, [160, 320, 560])} sizes="(max-width: 600px) 110px, (max-width: 1024px) 170px, 240px" alt="" width="280" height="320" />
      </NavLink>
      <div className="bag-product-info">
        <h2 className="bag-product-title">
          <NavLink to={`/product-page/${id}`}>
            <span>{name}</span>
            <span className="bag-title-reveal" aria-hidden="true">{name}</span>
          </NavLink>
        </h2>
        <p className="bag-product-total"><span className="bag-number" key={quantity}>{priceFormatter.format(price * quantity)}<small>¥</small></span></p>
      </div>
      <div className="bag-product-controls">
        <div className="bag-quantity" role="group" aria-label={`Quantity of ${name}`}>
          <button className="quantity-button" type="button" onClick={() => quantity === 1 ? removeProduct() : decrementFromCart(id)} aria-label={`Remove one ${name}`}>
            <span aria-hidden="true">−</span>
          </button>
          <output aria-live="polite" aria-atomic="true"><span className="bag-number" key={quantity}>{quantity}</span></output>
          <button className="quantity-button" type="button" onClick={() => addToCart(product)} aria-label={`Add one ${name}`}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
        <button className="remove-product" type="button" onClick={removeProduct} aria-label={`Remove ${name} from bag`}>Remove</button>
      </div>
    </article>
  )
}

export default ShoppingBagTabComponent
