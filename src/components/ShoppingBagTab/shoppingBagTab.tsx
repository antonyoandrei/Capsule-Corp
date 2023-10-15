import { clProduct } from '../../types/interface';
import { FC, useContext } from 'react';
import { useCart } from '../CartContext/cartContext';
import { ClothesContext } from '../Fetch/clothes-fetch';
import { ItemsContext } from '../Fetch/items-fetch';

const ShoppingBagTabComponent:FC<clProduct> = ({ id, name, img, price, quantity }) => {
  const { clothes } = useContext(ClothesContext);
  const { items } = useContext(ItemsContext);
  const { addToCart, removeFromCart, decrementFromCart } = useCart() as unknown as CartContextType
  const allItems = [...clothes, ...items];

  const selectedProductId = id;

  const selectedProduct = allItems.find((product) => product.id === selectedProductId) as clProduct;
  interface CartContextType {
    addToCart: (product: clProduct) => void;
    decrementFromCart: (product: clProduct) => void;
    removeFromCart: (productId: number) => void;
    cart: clProduct[];
  }

  const handleIncrement = () => {
    addToCart({ ...selectedProduct, quantity: 1 });
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      decrementFromCart({ ...selectedProduct, quantity: 1 });
    } else if (quantity === 1) {
      removeFromCart(id);
    }
  };
  
  return (
        <div className="product">
            <div key={id} className="tab"><img className="product-img" src={img} alt={name} /></div>
            <div className="product-title">{name}</div>
            <div className="product-price">{price*quantity}¥</div>
            <div className="counter">
              <label htmlFor="clicks"></label>
              <button className="plus" id="plus" onClick={handleIncrement}><img className="plus" src="https://res.cloudinary.com/du94mex28/image/upload/v1695892849/icons/nl0cjxrlfvdvxqwzwyin.png" alt="Plus" /></button>
              <input type="text" value={quantity} className="rectangle-6" id="clicks" name="clicks" required readOnly />
              <button className="minus" id="minus" onClick={handleDecrement}><img className="minus" src="https://res.cloudinary.com/du94mex28/image/upload/v1695892849/icons/f3mlw7jsvbqjpsllxhjg.png" alt="Minus" /></button>
            </div>
          </div>
    );
}

export default ShoppingBagTabComponent