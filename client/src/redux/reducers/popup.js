import { RESET_POPUP_STATE, SET_EDIT, SET_ID, SET_OPEN } from '../actionTypes';

const initialState = {
    open: false,
    edit: false,
    id: '',
};

export default function popup(state = initialState, action) {
    switch (action.type) {
        case RESET_POPUP_STATE: {
            return initialState;
        }
        case SET_OPEN: {
            const { open } = action.payload;
            return {
                ...state,
                open,
            };
        }
        case SET_EDIT: {
            const { edit } = action.payload;
            return {
                ...state,
                edit,
            };
        }
        case SET_ID: {
            const { id } = action.payload;
            return {
                ...state,
                id,
            };
        }
        default:
            return state;
    }
}
