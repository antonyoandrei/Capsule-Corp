import { useCallback, useMemo, useReducer } from "react";
import authReducer from "./authReducer";
import { AuthUser, types } from "./types/types";
import { AuthContext } from "./authContext";

const init = () => {
    const userJSON = localStorage.getItem('user');
    let user: AuthUser | null = null;

    if (userJSON) {
        try {
            const parsedUser = JSON.parse(userJSON) as AuthUser;
            user = parsedUser?.name ? parsedUser : null;
        } catch {
            localStorage.removeItem('user');
        }
    }

    return {
        isLogged: !!user,
        user
    };
}

interface PrivateRoutesProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<PrivateRoutesProps> = ({ children }) => {
    
    const [authState, dispatch] = useReducer(authReducer, undefined, init)
    
    const login = useCallback((name = '') => {
        const user = {
            id: 1,
            name: name.trim(),
        } satisfies AuthUser;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: types.login, payload: user});
    }, [])
    
    const logout = useCallback(() => {
        localStorage.removeItem('user');
        dispatch({ type: types.logout, payload: null});
    }, [])

    const value = useMemo(() => ({ ...authState, login, logout }), [authState, login, logout]);
    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}

export default AuthProvider
