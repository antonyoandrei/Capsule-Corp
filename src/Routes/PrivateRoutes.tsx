import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthContext } from "../components/Auth/authContext"

const PrivateRoutes = () => {
  const { isLogged } = useContext(AuthContext)
  const location = useLocation()

  return isLogged ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoutes
