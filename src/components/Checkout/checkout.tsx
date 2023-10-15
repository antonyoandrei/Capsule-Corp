import React, { useState } from 'react';
import './checkout.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { clProduct } from '../../types/interface';
import CheckoutTabComponent from '../CheckoutTab/checkoutTab';
import { useCart } from '../CartContext/cartContext';

interface CheckoutProps {
  isVisible: boolean;
  onClose: () => void;
  totalPrice: number
}

const CheckoutComponent: React.FC<CheckoutProps> = ({ isVisible, onClose, totalPrice}) => {
  const [showThxContainer, setShowThxContainer] = useState(false);
  const [showDetailsContainer, setShowDetailsContainer] = useState(false);
  const [showProductContainer, setShowProductContainer] = useState(false);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [addressValid, setAddressValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phoneNumber: ''
  });

  const handleCompleteOrder = () => {
    if (formData.address && formData.email && formData.firstName && formData.lastName && formData.phoneNumber) {
      setShowThxContainer(true);
      setShowDetailsContainer(false);
      setTimeout(() => {
        localStorage.removeItem("cart")
        window.location.href='/';
      }, 4000);
    } else {
      setFirstNameValid(formData.firstName !== '');
      setLastNameValid(formData.lastName !== '');
      setAddressValid(formData.address !== '');
      setEmailValid(formData.email !== '');
      setPhoneNumberValid(formData.phoneNumber !== '');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const phoneNumberPattern = /[0-9]/;

    if (name === 'phoneNumber' && !phoneNumberPattern.test(value)) {
      return; 
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    switch (name) {
      case 'firstName':
        setFirstNameValid(value !== '');
        break;
      case 'lastName':
        setLastNameValid(value !== '');
        break;
      case 'address':
        setAddressValid(value !== '');
        break;
      case 'email':
        setEmailValid(value !== '');
        break;
      case 'phoneNumber':
        setPhoneNumberValid(value !== '');
        break;
      default:
        break;
    }
  };

  interface CartContextType {
    cart: clProduct[];
  }
  const { cart } = useCart() as unknown as CartContextType;

  const handleOrderDetails = () => {
    setShowDetailsContainer(true);
    setShowProductContainer(true);
  };

  const checkoutCardClass = isVisible ? 'checkout-card shown' : 'checkout-card hidden';
  const productContainerClass = showProductContainer ? 'checkout-product-container hidden' : 'checkout-product-container';
  const detailsContainerClass = showDetailsContainer ? 'checkout-details-container shown' : 'checkout-details-container hidden';
  const thxContainerClass = showThxContainer ? 'checkout-thx-container shown' : 'checkout-thx-container hidden';

  return (
    <div className={checkoutCardClass}>
      <button className="checkout-exit" onClick={onClose}></button>
      <div className="checkout-container">
        <div className="checkout-img-container">
          <img className="checkout-img" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/zb6e94aiijfnqnv6ukcc" alt="Checkout Image" />
        </div>
        <div className={productContainerClass}>
          <p className="checkout-text">Total: {totalPrice}¥</p>
          <Swiper slidesPerView={2} pagination={{clickable: true, dynamicBullets: true,}} modules={[Pagination]} className="mySwiper" 
          breakpoints={{
            500: {
              slidesPerView: 2,
              spaceBetween: 100,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            }}}>
          <div className="product-checkout">
            {cart.map((props: clProduct) => (
            <SwiperSlide><CheckoutTabComponent key={props.id} {...props} /></SwiperSlide>
            ))}
          </div>
          </Swiper>
          <button type="button" onClick={handleOrderDetails} className="checkout-btn">
            <div className="rectangle-checkout"></div>
            <div className="checkout-btn2">Shipping details</div>
          </button>
        </div>
        <div className={detailsContainerClass}>
          <form className="checkout-form">
          <div className='input-container'>
            <input
              className="checkout-input-form"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={() => setFirstNameValid(formData.firstName !== '')}
              autoComplete='off'
              required
            />
            {!firstNameValid && <p className="validation-message">First name missing!</p>}
          </div>
          <br/>
          <div className='input-container'>       
            <input
              className="checkout-input-form"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => setLastNameValid(formData.lastName !== '')}
              autoComplete='off'
              required
            />
            {!lastNameValid && <p className="validation-message">Last name missing!</p>}
          </div>
          <br/>
          <div className='input-container'> 
            <input
              className="checkout-input-form"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              onBlur={() => setAddressValid(formData.address !== '')}
              autoComplete='off'
              required
            />
            {!addressValid && <p className="validation-message">Address missing!</p>}
          </div>
          <br/> 
          <div className='input-container'>
            <input
              className="checkout-input-form"
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => setEmailValid(formData.email !== '')}
              autoComplete='off'
              required
            />
            {!emailValid && <p className="validation-message">Email missing!</p>}
          </div>
          <br/>
          <div className='input-container'>
            <input
              className="checkout-input-form"
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              onBlur={() => setPhoneNumberValid(formData.phoneNumber !== '')}
              autoComplete='off'
              maxLength={9}
              required
            />
            {!phoneNumberValid && <p className="validation-message">Phone number missing!</p>}
          </div>
          <br/> 
        </form>
            <button type="button" onClick={handleCompleteOrder} className="order-checkout-btn">
              <div className="order-rectangle-checkout"></div>
              <div className="order-checkout-btn2">Complete order</div>
            </button>
        </div>
        <div className={thxContainerClass}>
          <p className="checkout-thx-text">Thank you for your order!</p>
          <div className="checkout-thx">
            <img className="checkout-thx-img" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/wcvfhwcex2royqqpbbfn" alt="Thank You Image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutComponent;
