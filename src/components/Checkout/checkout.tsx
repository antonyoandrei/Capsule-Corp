import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { createPortal, flushSync, preload } from "react-dom"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import CheckoutTabComponent from "../CheckoutTab/checkoutTab"
import { useCart } from "../CartContext/useCart"
import StoreIcon from "../ui/StoreIcon/storeIcon"
import FadeImage from "../ui/FadeImage/fadeImage"
import { artwork, capsuleCorpLogo } from "../../services/artwork"
import "../ui/StoreButton/store-button.css"
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

type CheckoutStep = "products" | "details" | "complete"

const SHEET_EXIT_DURATION = 400
const nimbusJourney = artwork("nimbusJourney", 1998)
const deliveryArtwork = "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto,c_limit,w_960/v1/bgs/wcvfhwcex2royqqpbbfn"

const CheckoutComponent = ({ isVisible, onClose, totalPrice }: CheckoutProps) => {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>("products")
  const [isChangingStep, setIsChangingStep] = useState(false)
  const [hasTravelled, setHasTravelled] = useState(false)
  const [isRendered, setIsRendered] = useState(isVisible)
  const [animationState, setAnimationState] = useState<"opening" | "open" | "closing">("opening")
  const [sheetMode, setSheetMode] = useState<"compact" | "expanded">("compact")
  const [isDragging, setIsDragging] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CheckoutFormData>({ mode: "onBlur" })
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLHeadingElement>(null)
  const stepAnimationRef = useRef<Animation | null>(null)
  const dragStartRef = useRef<number | null>(null)
  const dragDeltaRef = useRef(0)
  const dragMovedRef = useRef(false)
  const finishTimerRef = useRef<number | null>(null)

  const closeCheckout = useCallback(() => {
    // Hold the current frame while the entire sheet closes.
    stepAnimationRef.current?.pause()
    setAnimationState("closing")
    setIsDragging(false)
    dragStartRef.current = null
    dragDeltaRef.current = 0
    sheetRef.current?.style.removeProperty("--checkout-drag-y")
    sheetRef.current?.style.removeProperty("--checkout-drag-height")
    onClose()
  }, [onClose])

  useLayoutEffect(() => {
    let transitionTimer: number | undefined
    let openingFrame: number | undefined

    if (isVisible) {
      stepAnimationRef.current?.cancel()
      setIsChangingStep(false)
      setIsRendered(true)
      setAnimationState("opening")
      openingFrame = window.requestAnimationFrame(() => {
        openingFrame = window.requestAnimationFrame(() => setAnimationState("open"))
      })
    } else if (isRendered) {
      setAnimationState("closing")
      transitionTimer = window.setTimeout(() => {
        stepAnimationRef.current?.cancel()
        setIsRendered(false)
        setStep("products")
        setIsChangingStep(false)
        setHasTravelled(false)
        setSheetMode("compact")
        reset()
      }, SHEET_EXIT_DURATION)
    }

    return () => {
      if (transitionTimer !== undefined) window.clearTimeout(transitionTimer)
      if (openingFrame !== undefined) window.cancelAnimationFrame(openingFrame)
    }
  }, [isRendered, isVisible, reset])

  useEffect(() => {
    if (!isRendered) return
    triggerRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus({ preventScroll: true })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeCheckout()
        return
      }
      if (event.key !== "Tab" || !sheetRef.current) return
      const sheet = sheetRef.current
      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]"))
        .filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && !element.closest("[inert]") && element.getClientRects().length > 0 && getComputedStyle(element).visibility === "visible")
      if (focusable.length === 0) {
        event.preventDefault()
        sheet.focus({ preventScroll: true })
        return
      }
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)
      const shouldWrap = event.shiftKey
        ? currentIndex <= 0
        : currentIndex < 0 || currentIndex === focusable.length - 1
      if (shouldWrap) {
        event.preventDefault()
        focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      const returnFocus = triggerRef.current?.isConnected
        ? triggerRef.current
        : document.querySelector<HTMLElement>(".shopping-heading h1") ?? document.querySelector<HTMLElement>("#main-content")
      returnFocus?.focus({ preventScroll: true })
    }
  }, [closeCheckout, isRendered])

  useEffect(() => () => {
    if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current)
    stepAnimationRef.current?.cancel()
  }, [])

  useEffect(() => {
    if (step === "complete") confirmationRef.current?.focus({ preventScroll: true })
  }, [step])

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

  const changeStep = async (nextStep: CheckoutStep) => {
    if (stepAnimationRef.current || isChangingStep || !isVisible || nextStep === step) return
    setIsChangingStep(true)
    if (nextStep === "details") preload(deliveryArtwork, { as: "image" })
    const content = nextStep === "complete"
      ? contentRef.current
      : contentRef.current?.querySelector<HTMLElement>(".checkout-step")
    let animation: Animation | undefined
    try {
      if (content && typeof content.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const current = getComputedStyle(content)
        animation = content.animate([
          { opacity: current.opacity, transform: current.transform },
          { opacity: 0, transform: "translateY(-6px)" },
        ], { duration: 160, easing: "ease-in", fill: "forwards" })
        stepAnimationRef.current = animation
        await animation.finished
      }
      // Commit the replacement while the outgoing content is still hidden.
      flushSync(() => {
        if (nextStep === "complete") clearCart()
        if (nextStep === "details") setHasTravelled(true)
        setStep(nextStep)
        setIsChangingStep(false)
      })
    } catch {
      // Closing the sheet cancels the transition and leaves the bag intact.
    } finally {
      animation?.cancel()
      stepAnimationRef.current = null
      setIsChangingStep(false)
    }
  }

  const finishCheckout = () => {
    closeCheckout()
    finishTimerRef.current = window.setTimeout(() => {
      navigate("/homepage", { replace: true })
    }, SHEET_EXIT_DURATION)
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
        tabIndex={-1}
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
            <span>Checkout</span>
          </div>
          <button ref={closeButtonRef} className="checkout-exit" onClick={closeCheckout} type="button" aria-label="Close checkout"><span className="checkout-exit-icon" aria-hidden="true"></span></button>
        </header>

        <div className="checkout-content" ref={contentRef} data-step={step} data-travelled={hasTravelled} inert={isChangingStep}>
        {step !== "complete" && (
          <div className="checkout-journey" data-step={step} data-travelled={hasTravelled}>
            <div className="checkout-journey-flight" aria-hidden="true">
              <span className="checkout-journey-trail">
                <img src={nimbusJourney} alt="" width="1998" height="248" decoding="async" />
              </span>
              <span className="checkout-journey-trail checkout-journey-trail--return">
                <img src={nimbusJourney} alt="" width="1998" height="248" decoding="async" />
              </span>
              <span className="checkout-journey-position">
                <span className="checkout-journey-nimbus">
                  <img src={nimbusJourney} alt="" width="1998" height="248" decoding="async" />
                </span>
              </span>
            </div>
            <ol className="checkout-progress" aria-label="Checkout steps">
              <li aria-current={step === "products" ? "step" : undefined}>Summary</li>
              <li aria-current={step === "details" ? "step" : undefined}>Shipping</li>
            </ol>
          </div>
        )}

        {step === "products" && (
          <section className="checkout-product-container checkout-step">
            <div className="checkout-heading">
              <h2 id="checkout-title">Order summary</h2>
            </div>
            <div className="checkout-order-list" aria-label="Products in this order">
              {cart.map(product => (
                <CheckoutTabComponent key={product.id} {...product} />
              ))}
            </div>
            <aside className="checkout-total-panel">
              <span>Order total</span>
              <strong>{new Intl.NumberFormat("en-US").format(totalPrice)}¥</strong>
              <button type="button" onClick={() => void changeStep("details")} className="checkout-btn store-button store-button--text">
                <span>Shipping details</span>
              </button>
            </aside>
          </section>
        )}

        {step === "details" && (
          <section className="checkout-details-container checkout-step">
            <div className="checkout-heading">
              <h2 id="checkout-title">Shipping details</h2>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit(() => changeStep("complete"))} aria-busy={isSubmitting} inert={isSubmitting} noValidate>
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
                <button type="button" className="checkout-back store-button store-button--quiet" onClick={() => void changeStep("products")}>Back<span className="store-button-icon"><StoreIcon name="arrow" /></span></button>
                <button type="submit" className="order-checkout-btn store-button store-button--dark" disabled={isSubmitting}>
                  <span>{isSubmitting ? "Completing…" : "Complete order"}</span>
                  <span className="store-button-icon"><StoreIcon name="bag" /></span>
                </button>
              </div>
            </form>
          </section>
        )}

        {step === "complete" && (
          <section className="checkout-thx-container checkout-step">
            <FadeImage className="checkout-thx-img" src={deliveryArtwork} alt="" loading="eager" />
            <span className="checkout-confirmation-mark" aria-hidden="true"><span className="store-button-check" /></span>
            <h2 ref={confirmationRef} className="checkout-thx-text" id="checkout-title" tabIndex={-1}>Thank you for your order</h2>
            <p>Your bag is cleared and the order is complete.</p>
            <button className="checkout-btn checkout-finish store-button store-button--text" type="button" onClick={finishCheckout}>
              <span>Continue shopping</span>
            </button>
          </section>
        )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CheckoutComponent
