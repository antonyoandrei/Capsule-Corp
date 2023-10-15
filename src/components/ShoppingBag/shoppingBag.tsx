import { useEffect, useState } from 'react';
import './shopping-bag.css'
import CheckoutComponent from '../Checkout/checkout';
import HeaderLoginComponent from '../Header/header-login';
import HeaderNavComponent from '../Header/header-nav';
import { clProduct } from '../../types/interface';
import { useCart } from '../CartContext/cartContext';
import ShoppingBagTabComponent from '../ShoppingBagTab/shoppingBagTab';

function ShoppingBagComponent() {

  const { cart } = useCart() as unknown as { cart: clProduct[] };

  const [showCheckout, setShowCheckout] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const newTotalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cart]);

  const toggleCheckout = () => {
    setShowCheckout(!showCheckout);
  }
    return (
      <>
      <HeaderLoginComponent />
      <HeaderNavComponent />
      <div className="shopping-container">
        <div className="container-big">
          {cart.map((props: clProduct) => (
            <ShoppingBagTabComponent key={props.id} {...props} />
          ))}
        </div>
      </div>
      <button className="buy" onClick={toggleCheckout}>
        <div className="rectangle-2"></div>
        <div className="buy2">Buy Now</div>
      </button>
      <CheckoutComponent isVisible={showCheckout} onClose={toggleCheckout} totalPrice={totalPrice}/>
    </>
    );
  }
  
export default ShoppingBagComponent;
