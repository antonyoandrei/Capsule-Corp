import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../Auth/authContext"
import { capsuleCorpLogo } from "../../services/artwork"
import "./header-login.css"

function HeaderLoginComponent() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header className="header-1">
      <NavLink className="store-brand" to="/homepage" aria-label="Capsule Corp home">
        <span className="login-brand-glow" aria-hidden="true"></span>
        <img className="capsule-corp-1" src={capsuleCorpLogo} alt="Capsule Corp" />
      </NavLink>
      <div className="user-text">
        <span>Logged in</span>
        <strong>{user?.name ?? "Pilot"}</strong>
      </div>
      <button className="log-in" onClick={onLogout} type="button">
        <span>Log out</span>
        <span aria-hidden="true">↗</span>
      </button>
    </header>
  )
}

export default HeaderLoginComponent
