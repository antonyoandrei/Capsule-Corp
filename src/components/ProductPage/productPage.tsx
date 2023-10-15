import './product-page.css'
import { clProduct } from '../../types/interface';
import { useContext } from 'react';
import { ClothesContext } from '../Fetch/clothes-fetch';
import { ItemsContext } from '../Fetch/items-fetch';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useWishlist } from '../WishlistContext/wishlistContext';
import HeaderNavComponent from '../Header/header-nav';
import HeaderLoginComponent from '../Header/header-login';
import { useCart } from '../CartContext/cartContext';
import toast, { Toaster } from 'react-hot-toast';

const ProductPageComponent = (props: clProduct) => {
  interface WishlistContextType {
    addToWishlist: (product: clProduct) => void;
    removeFromWishlist: (productId: number) => void;
    wishlist: clProduct[];
  }

  interface CartContextType {
    addToCart: (product: clProduct) => void;
    removeFromCart: (productId: number) => void;
    cart: clProduct[];
  }

  const { clothes } = useContext(ClothesContext);
  const { items } = useContext(ItemsContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist() as unknown as WishlistContextType;
  const { addToCart } = useCart() as unknown as CartContextType

  const allItems = [...clothes, ...items];

  const selectedProductId = props.id;

  const selectedProduct = allItems.find((product) => product.id === selectedProductId) as clProduct;
  
  const isAlreadyInWishlist = wishlist.some((item: { id: number; }) => item.id === selectedProduct.id);

  const handleAddToWishlist = () => {
    const isAlreadyInWishlist = wishlist.some((item: { id: number; }) => item.id === selectedProduct.id);

    if (isAlreadyInWishlist) {
      removeFromWishlist(selectedProduct.id);
    } else {
      addToWishlist(selectedProduct);
    }
  };
  
  const notify = () => toast.success('Product added to cart!');

  const handleAddToCart = () => {
    addToCart({ ...selectedProduct, quantity: 1 });
    notify()
  }

  return (
    <div>
      <HeaderLoginComponent />
      <HeaderNavComponent />
      <Toaster
        toastOptions={{
          success: {
            iconTheme: {
              primary: 'var(--primary-yellow)',
              secondary: 'var(--clr-white)',
            },
            style: {
              background: 'var(--clr-black)',
              color: 'var(--clr-white)',
            }
          },
          position: 'bottom-right',
        }}
      />
      <button onClick={() => history.back()} className="back"></button>
      <div className="product-container">
        <div className="product-card">
          <Swiper navigation={true} loop={true} modules={[Navigation]} className='productSwiper'>
            <div className="product">
              {selectedProduct?.images.map((image: string, id: number) => (
                <SwiperSlide key={id}>
                  <img className="product-image" src={image} alt={`product-${id}`} />
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
        </div>
        <div className="product-details">
          <p className="details-title">{selectedProduct?.name}</p>
          <p className="details-description">{selectedProduct?.description}</p>
          <p className="details-price">{selectedProduct?.price}¥</p>
          <div className="details-btns">
            <button className="cart-btn" onClick={handleAddToCart}>
              <div className="cart-rectangle"></div>
              <div className="cart-btn2">Add to cart</div>
            </button>
            <button className="fav-btn" onClick={handleAddToWishlist}>
              <div className="fav-rectangle">
                <div className={`${isAlreadyInWishlist ? 'fav-img-added' : 'fav-img'}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageComponent;