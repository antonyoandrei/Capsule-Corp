import { CartItem } from '../CartContext/useCart';

const CheckoutTabComponent = ({ id, name, img, price, quantity }: CartItem) => {
    return (
      <article className="checkout-line">
        <div className="checkout-line-image">
          <img src={img} alt="" />
        </div>
        <div className="checkout-line-copy">
          <span>REF {String(id).padStart(3, '0')} · QTY {quantity}</span>
          <strong>{name}</strong>
        </div>
        <strong className="checkout-line-price">{new Intl.NumberFormat('en-US').format(price * quantity)}¥</strong>
      </article>
    );
}

export default CheckoutTabComponent
