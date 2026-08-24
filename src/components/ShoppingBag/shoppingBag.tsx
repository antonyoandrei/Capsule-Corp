import { useCallback, useMemo, useState } from "react"
import CheckoutComponent from "../Checkout/checkout"
import { useCart } from "../CartContext/useCart"
import ShoppingBagTabComponent from "../ShoppingBagTab/shoppingBagTab"
import DataState from "../ui/DataState/dataState"
import "./shopping-bag.css"

const priceFormatter = new Intl.NumberFormat("en-US")

function ShoppingBagComponent() {
  const { cart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const closeCheckout = useCallback(() => setShowCheckout(false), [])
  const totalPrice = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart])
  const totalQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])

  return (
    <>
      <section className="shopping-container">
        <header className="shopping-heading">
          <div>
            <span>CAPSULE CORP. ORDER</span>
            <h1>Shopping bag</h1>
          </div>
          <p
            className="shopping-count"
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
            <div className={`container-big${cart.length > 2 ? " has-sticky-clearance" : ""}`}>
              {cart.map(product => <ShoppingBagTabComponent key={product.id} {...product} />)}
            </div>
            <aside className="shopping-summary">
              <span className="shopping-summary-kicker">Order summary</span>
              <div className="shopping-summary-line">
                <span>Products</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div className="shopping-summary-total">
                <span>Total</span>
                <strong>{priceFormatter.format(totalPrice)}¥</strong>
              </div>
              <button className="buy" type="button" onClick={() => setShowCheckout(true)}>
                <span className="buy-background"></span>
                <span className="buy2">Review order</span>
              </button>
              <small>Shipping details are confirmed in the next step.</small>
            </aside>
          </div>
        )}
      </section>
      <CheckoutComponent isVisible={showCheckout} onClose={closeCheckout} totalPrice={totalPrice} />
    </>
  )
}

export default ShoppingBagComponent
