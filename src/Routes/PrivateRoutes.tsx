import { useContext } from "react"
import { AuthContext } from "../components/Auth/authContext"
import { Navigate } from "react-router-dom"

interface PrivateRoutesProps {
    children: React.ReactNode;
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ children }) => {
    const { isLogged } = useContext(AuthContext)

    return isLogged ? children : <Navigate to={"/login"} />
}

export default PrivateRoutes