import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../Auth/authContext"
import { useCart } from "../CartContext/useCart"
import capsuleCorpLogo from "../../../capsule-corp-seeklogo.svg"
import "./header-nav.css"

const navigation = [
  {
    to: "/homepage",
    label: "Home",
    icon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/ji2pobtmdtpqfb3ghijh",
    activeIcon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/v0udcx32pqdnbzw0jwof",
  },
  {
    to: "/wishlist",
    label: "Wishlist",
    icon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/p8qadpxx54bvzfi6yrjk",
    activeIcon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/wjvozcit5wfkmj2aiykl",
  },
  {
    to: "/about",
    label: "About",
    icon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/yqfeaojofaah3ezhuqhu",
    activeIcon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/j7ogpokdlsrgcdyq9flb",
  },
  {
    to: "/shopping-bag",
    label: "Shopping bag",
    icon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/adezj5ftjcjppyez5v1i",
    activeIcon: "https://res.cloudinary.com/du94mex28/image/upload/f_auto,q_auto/v1/icons/wcojhw921soonkxeqan3",
  },
]

function HeaderNavComponent() {
  const { cart } = useCart()
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0)

  const onLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="store-header">
      <NavLink className="store-header-brand" to="/homepage" aria-label="Capsule Corp home">
        <img src={capsuleCorpLogo} alt="" />
      </NavLink>

      <nav className="header-2" aria-label="Main navigation">
        <div className="header-box">
          {navigation.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-label={item.label}
              data-nav={item.to.slice(1)}
              className={({ isActive }) => `header-link${isActive ? " is-active" : ""}`}
            >
              <span className="header-section">
                {item.to === "/shopping-bag" && cartQuantity > 0 ? (
                  <span className="item-quantity" aria-label={`${cartQuantity} ${cartQuantity === 1 ? "product" : "products"} in shopping bag`}>{cartQuantity}</span>
                ) : null}
                <span className="header-icon-stack" aria-hidden="true">
                  <img className="header-icon header-icon-default" src={item.icon} alt="" />
                  <img className="header-icon header-icon-active" src={item.activeIcon} alt="" />
                </span>
                <span className="header-text">{item.label}</span>
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="header-account">
        <span className="header-user" title={user?.name}>{user?.name}</span>
        <button className="header-logout" onClick={onLogout} type="button" aria-label="Log out">
          <span className="header-logout-icon" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  )
}

export default HeaderNavComponent
