import { useCallback, useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import CheckoutTabComponent from "../CheckoutTab/checkoutTab"
import { useCart } from "../CartContext/useCart"
import capsuleCorpLogo from "../../../capsule-corp-seeklogo.svg"
import "./checkout.css"

interface CheckoutProps {
  isVisible: boolean
  onClose: () => void
  totalPrice: number
}

interface CheckoutFormData {
  firstName: string
  lastName: string
  address: string
  email: string
  phoneNumber: string
}

const SHEET_EXIT_DURATION = 400

const CheckoutComponent = ({ isVisible, onClose, totalPrice }: CheckoutProps) => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const [step, setStep] = useState<"products" | "details" | "complete">("products")
  const [isRendered, setIsRendered] = useState(isVisible)
  const [animationState, setAnimationState] = useState<"opening" | "open" | "closing">(isVisible ? "open" : "closing")
  const [sheetMode, setSheetMode] = useState<"compact" | "expanded">("compact")
  const [isDragging, setIsDragging] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CheckoutFormData>({ mode: "onBlur" })
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<number | null>(null)
  const dragDeltaRef = useRef(0)
  const dragMovedRef = useRef(false)
  const finishTimerRef = useRef<number | null>(null)

  const closeCheckout = useCallback(() => {
    setAnimationState("closing")
    setIsDragging(false)
    dragStartRef.current = null
    dragDeltaRef.current = 0
    sheetRef.current?.style.removeProperty("--checkout-drag-y")
    sheetRef.current?.style.removeProperty("--checkout-drag-height")
    onClose()
  }, [onClose])

  useEffect(() => {
    let transitionTimer: number | undefined

    if (isVisible) {
      setIsRendered(true)
      setAnimationState("opening")
      transitionTimer = window.setTimeout(() => setAnimationState("open"), 20)
    } else if (isRendered) {
      setAnimationState("closing")
      transitionTimer = window.setTimeout(() => {
        setIsRendered(false)
        setStep("products")
        setSheetMode("compact")
        reset()
      }, SHEET_EXIT_DURATION)
    }

    return () => {
      if (transitionTimer !== undefined) window.clearTimeout(transitionTimer)
    }
  }, [isRendered, isVisible, reset])

  useEffect(() => {
    if (!isRendered) return
    triggerRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus({ preventScroll: true })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCheckout()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [closeCheckout, isRendered])

  useEffect(() => () => {
    if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current)
  }, [])

  const beginSheetDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!window.matchMedia("(max-width: 43.75rem)").matches) return
    dragStartRef.current = event.clientY
    dragDeltaRef.current = 0
    dragMovedRef.current = false
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveSheet = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStartRef.current === null || !sheetRef.current) return
    const limit = window.innerHeight * 0.72
    const delta = Math.max(-window.innerHeight * 0.28, Math.min(limit, event.clientY - dragStartRef.current))
    dragDeltaRef.current = delta
    if (Math.abs(delta) > 6) dragMovedRef.current = true
    sheetRef.current.style.setProperty("--checkout-drag-y", `${Math.max(0, delta)}px`)
    sheetRef.current.style.setProperty("--checkout-drag-height", `${sheetMode === "compact" ? Math.max(0, -delta) : 0}px`)
  }

  const endSheetDrag = (event: ReactPointerEvent<HTMLElement>, cancelled = false) => {
    if (dragStartRef.current === null) return
    const delta = dragDeltaRef.current
    const clearDragStyles = () => {
      sheetRef.current?.style.removeProperty("--checkout-drag-y")
      sheetRef.current?.style.removeProperty("--checkout-drag-height")
    }
    if (dragHandleRef.current?.hasPointerCapture(event.pointerId)) dragHandleRef.current.releasePointerCapture(event.pointerId)
    dragStartRef.current = null
    dragDeltaRef.current = 0
    setIsDragging(false)

    if (cancelled) {
      clearDragStyles()
      return
    }
    if (delta < -44) {
      setSheetMode("expanded")
      window.requestAnimationFrame(clearDragStyles)
      return
    }

    if (delta <= 0) {
      clearDragStyles()
      return
    }
    const closeThreshold = sheetMode === "expanded"
      ? Math.min(210, window.innerHeight * 0.28)
      : Math.min(140, window.innerHeight * 0.22)

    if (delta > closeThreshold) {
      clearDragStyles()
      closeCheckout()
    } else if (sheetMode === "expanded" && delta > 52) {
      setSheetMode("compact")
      window.requestAnimationFrame(clearDragStyles)
    } else {
      clearDragStyles()
    }
  }

  const toggleSheetMode = () => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }
    setSheetMode(current => current === "compact" ? "expanded" : "compact")
  }

  const completeOrder = () => {
    clearCart()
    setStep("complete")
  }

  const finishCheckout = () => {
    closeCheckout()
    finishTimerRef.current = window.setTimeout(() => {
      navigate("/homepage", { replace: true })
    }, SHEET_EXIT_DURATION - 20)
  }

  if (!isRendered) return null

  return createPortal(
    <div
      className="checkout-card"
      data-state={animationState}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onPointerDown={event => {
        if (event.target === event.currentTarget) closeCheckout()
      }}
      onPointerMove={event => {
        if (isDragging) moveSheet(event)
      }}
      onPointerUp={event => {
        if (isDragging) endSheetDrag(event)
      }}
      onPointerCancel={event => {
        if (isDragging) endSheetDrag(event, true)
      }}
    >
      <div
        ref={sheetRef}
        className="checkout-container"
        data-sheet={sheetMode}
        data-dragging={isDragging ? "true" : "false"}
      >
        <button
          ref={dragHandleRef}
          className="checkout-drag-handle"
          type="button"
          aria-label={sheetMode === "compact" ? "Expand checkout" : "Restore checkout height"}
          aria-expanded={sheetMode === "expanded"}
          onClick={toggleSheetMode}
          onPointerDown={beginSheetDrag}
          onPointerMove={moveSheet}
          onPointerUp={event => endSheetDrag(event)}
          onPointerCancel={event => endSheetDrag(event, true)}
        >
          <span aria-hidden="true"></span>
        </button>
        <header className="checkout-topbar">
          <div className="checkout-brand">
            <img src={capsuleCorpLogo} alt="" />
            <span>Capsule checkout terminal</span>
          </div>
          <button ref={closeButtonRef} className="checkout-exit" onClick={closeCheckout} type="button" aria-label="Close checkout"><span className="checkout-exit-icon" aria-hidden="true"></span></button>
        </header>

        {step !== "complete" && (
          <ol className="checkout-progress">
            <li className={step === "products" ? "is-active" : "is-done"}>Summary</li>
            <li className={step === "details" ? "is-active" : ""}>Shipping</li>
          </ol>
        )}

        {step === "products" && (
          <section className="checkout-product-container checkout-step">
            <div className="checkout-heading">
              <span>STEP 01 / 02</span>
              <h2 id="checkout-title">Order summary</h2>
              <p>{itemCount} {itemCount === 1 ? "product" : "products"} ready for dispatch.</p>
            </div>
            <div className="checkout-order-list" aria-label="Products in this order">
              {cart.map(product => (
                <CheckoutTabComponent key={product.id} {...product} />
              ))}
            </div>
            <aside className="checkout-total-panel">
              <span>Order total</span>
              <strong>{new Intl.NumberFormat("en-US").format(totalPrice)}¥</strong>
              <button type="button" onClick={() => setStep("details")} className="checkout-btn">
                <span className="rectangle-checkout"></span>
                <span className="checkout-btn2">Shipping details</span>
              </button>
            </aside>
          </section>
        )}

        {step === "details" && (
          <section className="checkout-details-container checkout-step">
            <div className="checkout-heading">
              <span>STEP 02 / 02</span>
              <h2 id="checkout-title">Shipping details</h2>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit(completeOrder)} noValidate>
              <div className="checkout-form-grid">
                <label className="input-container">
                  <span>First name</span>
                  <input className="checkout-input-form" type="text" autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} {...register("firstName", { required: "Enter your first name." })} />
                  {errors.firstName && <small className="validation-message">{errors.firstName.message}</small>}
                </label>
                <label className="input-container">
                  <span>Last name</span>
                  <input className="checkout-input-form" type="text" autoComplete="family-name" aria-invalid={Boolean(errors.lastName)} {...register("lastName", { required: "Enter your last name." })} />
                  {errors.lastName && <small className="validation-message">{errors.lastName.message}</small>}
                </label>
                <label className="input-container input-wide">
                  <span>Address</span>
                  <input className="checkout-input-form" type="text" autoComplete="street-address" aria-invalid={Boolean(errors.address)} {...register("address", { required: "Enter your shipping address." })} />
                  {errors.address && <small className="validation-message">{errors.address.message}</small>}
                </label>
                <label className="input-container">
                  <span>Email</span>
                  <input className="checkout-input-form" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email", { required: "Enter your email.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email." } })} />
                  {errors.email && <small className="validation-message">{errors.email.message}</small>}
                </label>
                <label className="input-container">
                  <span>Phone number</span>
                  <input className="checkout-input-form" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phoneNumber)} {...register("phoneNumber", { required: "Enter your phone number.", pattern: { value: /^[0-9+()\s-]{7,18}$/, message: "Enter a valid phone number." } })} />
                  {errors.phoneNumber && <small className="validation-message">{errors.phoneNumber.message}</small>}
                </label>
              </div>
              <div className="checkout-actions">
                <button type="button" className="checkout-back" onClick={() => setStep("products")}>Back</button>
                <button type="submit" className="order-checkout-btn">
                  <span className="order-rectangle-checkout"></span>
                  <span className="order-checkout-btn2">Complete order</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {step === "complete" && (
          <section className="checkout-thx-container checkout-step">
            <img className="checkout-thx-img" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/wcvfhwcex2royqqpbbfn" alt="Capsule Corp delivery" />
            <h2 className="checkout-thx-text" id="checkout-title">Thank you for your order</h2>
            <p>Your bag is cleared and the order is complete.</p>
            <button className="checkout-btn checkout-finish" type="button" onClick={finishCheckout}>
              <span className="rectangle-checkout"></span>
              <span className="checkout-btn2">Continue shopping</span>
            </button>
          </section>
        )}
      </div>
    </div>,
    document.body
  )
}

export default CheckoutComponent
