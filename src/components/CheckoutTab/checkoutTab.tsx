import { clProduct } from '../../types/interface';
import { FC } from 'react';

const CheckoutTabComponent:FC<clProduct> = ({id, name, img, }) => {
    return (
            <div key={id} className="checkout-tab">
              <img className="product-img" src={img} alt={name} />
            </div>
    );
}

export default CheckoutTabComponent