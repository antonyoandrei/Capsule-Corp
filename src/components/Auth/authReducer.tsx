import { AuthUser, types } from "./types/types";

interface Action {
    payload?: AuthUser | null;
    type: string;
}

interface State {
    isLogged: boolean;
    user: AuthUser | null;
}

const authReducer = (state: State, action: Action): State => {
    switch(action?.type) {
        case types.login:
            return {
                ...state,
                isLogged: true,
                user: action.payload ?? null
            }
        case types.logout:
            return {
                isLogged:false,
                user: null,
            }
        default: 
            return state;
    }
}

export default authReducer;
