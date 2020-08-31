import { GET_ERRORS, CLEAR_ERRORS } from "./constants";

export const returnErrors = (msg, status, id = null) => {
    console.log('Error = ', msg);
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    };
};

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};