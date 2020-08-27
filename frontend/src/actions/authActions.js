import axios from 'axios';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./constants";
import { returnErrors } from "./errorActions";

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
    dispatch(({ type: USER_LOADING }));

    axios.get('/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

// Register user
export const register = ({ name, email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    axios.post('/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            });
        });
};

export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
};

// Find token and make header
export const tokenConfig = getState => {
    // get local token
    const token = getState().auth.token;

    // Build header
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    if (token) config.headers['x-auth-token'] = token;

    return config;

}