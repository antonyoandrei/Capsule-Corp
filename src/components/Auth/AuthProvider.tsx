import { useReducer } from "react";
import authReducer from "./authReducer";
import { types } from "./types/types";
import { AuthContext } from "./authContext";

const init = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        isLogged: !!user,
        user
    }
}

interface PrivateRoutesProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<PrivateRoutesProps> = ({ children }) => {
    
    const [authState, dispatch] = useReducer(authReducer, {}, init)

    console.log(authState)
    
    const login = (name = '') => {
        const user = {
            id: 1,
            name,
        }
        localStorage.setItem('user', JSON.stringify(user))
        dispatch({ type: types.login, payload: user})
    }
    
    const logout = () => {
        localStorage.removeItem('user')
        dispatch({ type: types.logout})
    }

    return <AuthContext.Provider value={{ ...authState, login: login, logout: logout}}> {children} </AuthContext.Provider>
}

export default AuthProvider