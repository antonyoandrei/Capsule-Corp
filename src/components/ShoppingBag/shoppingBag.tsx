import { useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useCart } from "../CartContext/useCart"
import ShoppingBagTabComponent from "../ShoppingBagTab/shoppingBagTab"
import DataState from "../ui/DataState/dataState"
import "../ui/StoreButton/store-button.css"
import "./shopping-bag.css"

const priceFormatter = new Intl.NumberFormat("en-US")
const loadCheckout = () => import("../Checkout/checkout")
const prefetchCheckout = () => { void loadCheckout().catch(() => undefined) }

function ShoppingBagComponent() {
  const { cart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [CheckoutComponent, setCheckoutComponent] = useState<typeof import("../Checkout/checkout").default | null>(null)
  const [checkoutPending, setCheckoutPending] = useState(false)
  const [checkoutLoadFailed, setCheckoutLoadFailed] = useState(false)
  const closeCheckout = useCallback(() => setShowCheckout(false), [])
  const totalPrice = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart])
  const totalQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])

  const openCheckout = async () => {
    if (checkoutPending) return
    if (checkoutLoadFailed) {
      window.location.reload()
      return
    }
    if (CheckoutComponent) {
      setShowCheckout(true)
      return
    }
    setCheckoutPending(true)
    try {
      const { default: component } = await loadCheckout()
      setCheckoutComponent(() => component)
      setShowCheckout(true)
    } catch {
      setCheckoutLoadFailed(true)
      toast.error("Checkout could not load. Reload the page to try again.")
    } finally {
      setCheckoutPending(false)
    }
  }

  return (
    <>
      <section className="shopping-container">
        <header className="shopping-heading">
          <h1 tabIndex={-1}>Shopping bag</h1>
          <p
            className="product-count"
            aria-label={`${totalQuantity} ${totalQuantity === 1 ? "product" : "products"}`}
          >
            <strong aria-hidden="true">{totalQuantity}</strong>
            <span aria-hidden="true">{totalQuantity === 1 ? "product" : "products"}</span>
          </p>
        </header>
        {cart.length === 0 ? (
          <DataState title="Your bag is empty" actionLabel="Browse clothes" to="/clothes">Add a product and it will appear here.</DataState>
        ) : (
          <div className="shopping-layout">
            <div className="bag-products">
              {cart.map(product => <ShoppingBagTabComponent key={product.id} {...product} />)}
            </div>
            <aside className="shopping-summary" aria-label="Order total">
              <div className="shopping-summary-total">
                <span>Total</span>
                <strong aria-live="polite" aria-atomic="true"><span className="bag-number" key={totalPrice}>{priceFormatter.format(totalPrice)}<small>¥</small></span></strong>
              </div>
              <button className="buy store-button store-button--text" type="button" aria-disabled={checkoutPending} aria-busy={checkoutPending} onPointerEnter={prefetchCheckout} onFocus={prefetchCheckout} onClick={openCheckout}>
                {checkoutPending ? "Opening…" : checkoutLoadFailed ? "Reload page" : "Review order"}
              </button>
            </aside>
          </div>
        )}
      </section>
      {CheckoutComponent && <CheckoutComponent isVisible={showCheckout} onClose={closeCheckout} totalPrice={totalPrice} />}
    </>
  )
}

export default ShoppingBagComponent
