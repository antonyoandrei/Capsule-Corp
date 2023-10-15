import { createContext } from "react";

export const AuthContext = createContext({
    isLogged: false,
    login: (_username: string) => {}, 
    user: (_username: string) => {},
    logout: () => {},
});