import { NavLink, useLocation } from 'react-router-dom';
import './header-nav.css';
import { useCart } from '../CartContext/cartContext';

function HeaderNavComponent() {
    const { cart } = useCart()

    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    }

    return (
        <section className="header-2">
            <div className="rectangle-1"></div>
            <div className="rectangle-4"></div>
            <img className="bg-effect-1" src="https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/bgs/xnqbsgfkkrxxwwffypkf" alt="Background Effect" />
            <section className="header-box">
                <NavLink to={'/'} className='header-link'>
                    <div className='header-section'>
                        <img className="header-icon" src={isActive('/homepage') ? 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/v0udcx32pqdnbzw0jwof' : 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/ji2pobtmdtpqfb3ghijh'} alt="Home Icon" />
                        <b className={`header-text ${isActive('/homepage') ? 'active' : ''}`}>HOME</b>
                    </div>
                </NavLink>
                <NavLink to={'/wishlist'} className='header-link'>
                    <div className='header-section'>
                        <img className="header-icon" src={isActive('/wishlist') ? 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/wjvozcit5wfkmj2aiykl' : 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/p8qadpxx54bvzfi6yrjk'} alt="Wishlist Icon" />
                        <b className={`header-text ${isActive('/wishlist') ? 'active' : ''}`}>WISHLIST</b>
                    </div>
                </NavLink>
                <NavLink to={'/about'} className='header-link'>
                    <div className='header-section'>
                        <img className="header-icon" src={isActive('/about') ? 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/j7ogpokdlsrgcdyq9flb' : 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/yqfeaojofaah3ezhuqhu'} alt="About Icon" />
                        <b className={`header-text ${isActive('/about') ? 'active' : ''}`}>ABOUT</b>
                    </div>
                </NavLink>
                <NavLink to={'/shopping-bag'} className='header-link'>
                    <div className='header-section'>
                        <div className="item-quantity">{cart.length}</div>
                        <img className="header-icon" src={isActive('/shopping-bag') ? 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/wcojhw921soonkxeqan3' : 'https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/adezj5ftjcjppyez5v1i'} alt="Shopping Bag Icon" />
                        <b className={`header-text ${isActive('/shopping-bag') ? 'active' : ''}`}>SHOPPING BAG</b>
                    </div>
                </NavLink>
            </section>
        </section>
    );
}

export default HeaderNavComponent;
