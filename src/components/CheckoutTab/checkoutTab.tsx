import { CartItem } from '../CartContext/useCart';
import { productImage } from '../../services/productImage';
import FadeImage from '../ui/FadeImage/fadeImage';

const priceFormatter = new Intl.NumberFormat('en-US');

const CheckoutTabComponent = ({ id, name, img, price, quantity }: CartItem) => {
    return (
      <article className="checkout-line">
        <div className="checkout-line-image">
          <FadeImage src={productImage(img, 160)} alt="" width="68" height="96" />
        </div>
        <div className="checkout-line-copy">
          <span>REF {String(id).padStart(3, '0')} · QTY {quantity}</span>
          <strong>{name}</strong>
        </div>
        <strong className="checkout-line-price">{priceFormatter.format(price * quantity)}¥</strong>
      </article>
    );
}

export default CheckoutTabComponent
