import { type FormEvent, useContext, useMemo, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { productImage } from "../../services/productImage"
import { AuthContext } from "../Auth/authContext"
import { ClothesContext } from "../Fetch/clothes-context"
import { ItemsContext } from "../Fetch/items-context"
import { useCart } from "../CartContext/useCart"
import StoreIcon from "../ui/StoreIcon/storeIcon"
import { capsuleCorpLogo } from "../../services/artwork"
import "./header-nav.css"

const navigation = [
  { to: "/homepage", label: "Home" },
  { to: "/clothes", label: "Clothes" },
  { to: "/items", label: "Items" },
  { to: "/most-buyed", label: "Most wanted" },
  { to: "/about", label: "About" },
]

function HeaderNavComponent() {
  const { cart } = useCart()
  const { logout } = useContext(AuthContext)
  const { clothes, loading: clothesLoading, error: clothesError } = useContext(ClothesContext)
  const { items, loading: itemsLoading, error: itemsError } = useContext(ItemsContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const productId = Number(pathname.match(/^\/product-page\/(\d+)\/?$/)?.[1])
  const productCategory = clothes.some(product => product.id === productId) ? "/clothes" : items.some(product => product.id === productId) ? "/items" : null
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const term = query.trim().toLowerCase()
  const matches = useMemo(
    () => term ? [...clothes, ...items].filter(product => product.name.toLowerCase().includes(term)).slice(0, 5) : [],
    [clothes, items, term]
  )
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0)
  const closeMenus = () => setMenuOpen(false)
  const signOut = () => { logout(); navigate("/login", { replace: true }) }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    if (matches[0]) {
      navigate("/product-page/" + matches[0].id)
      setQuery("")
      closeMenus()
    }
  }

  return (
    <header className="store-header" onKeyDown={event => {
      if (event.key !== "Escape") return
      if (menuOpen) {
        closeMenus()
        event.currentTarget.querySelector<HTMLButtonElement>(".header-menu-toggle")?.focus()
      }
    }}>
      <NavLink className="store-header-brand" to="/homepage" aria-label="Capsule Corp home" onClick={closeMenus}>
        <img src={capsuleCorpLogo} alt="" width="44" height="44" />
        <span className="store-brand-name">Capsule Corp</span>
      </NavLink>
      <nav id="store-navigation" className={"header-2" + (menuOpen ? " is-open" : "")} aria-label="Main navigation">
        {navigation.map(({ to, label }) => (
          <NavLink key={to} to={to} onClick={closeMenus} className={({ isActive }) => "header-link" + (to === "/homepage" ? " header-home-link" : "") + (isActive || to === productCategory ? " is-active" : "")}>
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="header-menu-logout" type="button" onClick={signOut}>Log out <StoreIcon name="logout" /></button>
      </nav>
      <form className="header-search" role="search" onSubmit={submitSearch} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setQuery("") }}>
        <StoreIcon name="search" />
        <input type="search" aria-label="Search products" placeholder="Search products" value={query} onFocus={closeMenus} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setQuery("") }} autoComplete="off" />
        {term && (
          <div className="header-search-results">
            {matches.length > 0 ? (
              <ul aria-label="Search results">
                {matches.map(product => (
                  <li key={product.id}>
                    <NavLink to={"/product-page/" + product.id} onClick={() => { setQuery(""); closeMenus() }}>
                      <img src={productImage(product.images?.[0] || product.img, 96)} alt="" width="42" height="42" decoding="async" />
                      <span>{product.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p role="status">{clothesLoading || itemsLoading ? "Loading products..." : clothesError || itemsError ? "Search is temporarily unavailable." : "No matching products."}</p>
            )}
          </div>
        )}
      </form>
      <div className="header-account">
        <NavLink className="header-action header-wishlist" to="/wishlist" aria-label="Wishlist" title="Wishlist" onClick={closeMenus}><StoreIcon name="dragonball" /></NavLink>
        <NavLink className="header-action header-bag" to="/shopping-bag" aria-label={"Shopping bag, " + cartQuantity + " products"} title="Shopping bag" onClick={closeMenus}>
          <StoreIcon name="bag" key={"bag-" + cartQuantity} />
          {cartQuantity > 0 && <span className="item-quantity" key={cartQuantity} aria-hidden="true">{cartQuantity}</span>}
        </NavLink>
        <button className="header-action header-logout" onClick={signOut} type="button" aria-label="Log out" title="Log out"><StoreIcon name="logout" /></button>
        <button className="header-action header-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="store-navigation" onClick={() => setMenuOpen(open => !open)}>
          <svg className="store-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} /></svg>
        </button>
      </div>
    </header>
  )
}

export default HeaderNavComponent
