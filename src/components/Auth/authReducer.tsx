import { types } from "./types/types";

interface Action {
    payload: any;
    type: string;
}

interface State {
    isLogged: boolean;
    user: string;
}

const authReducer = (state: State, action: Action) => {
    switch(action?.type) {
        case types.login:
            return {
                ...state,
                isLogged: true,
                user: action.payload
            }
        case types.logout:
            return {
                isLogged:false
            }
        default: state;
    }
}

export default authReducer;