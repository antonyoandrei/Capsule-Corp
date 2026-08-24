import { CartItem, useCart } from "../CartContext/useCart";

const priceFormatter = new Intl.NumberFormat("en-US");

const ShoppingBagTabComponent = (product: CartItem) => {
  const { id, name, img, price, quantity } = product;
  const { addToCart, removeFromCart, decrementFromCart } = useCart();

  return (
    <article className="bag-product">
      <div className="bag-product-image tab"><img className="product-img" src={img} alt={name} /></div>
      <div className="bag-product-info">
        <div className="bag-product-copy">
          <span className="bag-product-reference">REF {String(id).padStart(3, "0")}</span>
          <h2 className="product-title">{name}</h2>
        </div>
        <div className="product-price">{priceFormatter.format(price * quantity)}¥</div>
        <div className="bag-product-controls">
          <div className="counter" aria-label={`Quantity of ${name}`}>
            <button className="quantity-button" type="button" onClick={() => decrementFromCart(id)} aria-label={`Remove one ${name}`}>
              <img src="https://res.cloudinary.com/du94mex28/image/upload/v1695892849/icons/f3mlw7jsvbqjpsllxhjg.png" alt="" />
            </button>
            <output className="rectangle-6" aria-live="polite">{quantity}</output>
            <button className="quantity-button" type="button" onClick={() => addToCart(product)} aria-label={`Add one ${name}`}>
              <img src="https://res.cloudinary.com/du94mex28/image/upload/v1695892849/icons/nl0cjxrlfvdvxqwzwyin.png" alt="" />
            </button>
          </div>
          <button className="remove-product" type="button" onClick={() => removeFromCart(id)} aria-label={`Remove ${name} from bag`}>Remove</button>
        </div>
      </div>
    </article>
  );
};

export default ShoppingBagTabComponent;
