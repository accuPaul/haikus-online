import { GET_HAIKUS, ADD_HAIKU, DELETE_HAIKU, HAIKUS_LOADING } from '../actions/constants'

const initialState = {
    haikus: [],
    loading: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_HAIKUS:
            return {
                ...state,
                haikus: action.payload,
                loading: false
            };
        case DELETE_HAIKU:
            return {
                ...state,
                haikus: state.haikus.filter(haiku => haiku._id !== action.payload)
            };
        case ADD_HAIKU:
            return {
                ...state,
                haikus: [action.payload, ...state.haikus]
            };
        case HAIKUS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}