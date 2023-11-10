import { useReducer } from "react";
import authReducer from "./authReducer";
import { types } from "./types/types";
import { AuthContext } from "./authContext";

const init = () => {
    const userJSON = localStorage.getItem('user');
    const user = userJSON !== null ? JSON.parse(userJSON) : null;
    return {
        isLogged: !!user,
        user
    };
}

interface PrivateRoutesProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<PrivateRoutesProps> = ({ children }) => {
    
    const [authState, dispatch] = useReducer(authReducer, {}, init)
    
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
        dispatch({ type: types.logout, payload: null})
    }

    return <AuthContext.Provider value={{ ...authState, login: login, logout: logout}}> {children} </AuthContext.Provider>
}

export default AuthProvider