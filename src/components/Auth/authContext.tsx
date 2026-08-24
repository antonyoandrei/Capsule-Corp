import { createContext } from "react";
import { AuthUser } from "./types/types";

export interface AuthContextValue {
    isLogged: boolean;
    user: AuthUser | null;
    login: (username: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
    isLogged: false,
    user: null,
    login: () => undefined,
    logout: () => undefined,
});
