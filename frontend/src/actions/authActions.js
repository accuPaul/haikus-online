import axios from 'axios';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    BASE_URL
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

// Register new user
export async function register({ name, email, password }) {
    const controller = new AbortController();

    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password });

    return axios.post('/users', body, config, {
        signal: controller.signal,
    })
};

// Log in existing user...

export const login = ({ email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password });

    try {
        const response = await axios.post('/auth', body, config);
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        })

    } catch(error) {
        dispatch(returnErrors(error.response?.data?.msg, error.response.status, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL,
            error: { msg: error.response?.data?.msg }
        });
    }
    
};

// Log out user

export const logout = () => dispatch => {
    dispatch ({
        type: LOGOUT_SUCCESS,
    })

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