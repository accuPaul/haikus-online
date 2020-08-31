import { GET_HAIKUS, ADD_HAIKU, DELETE_HAIKU, HAIKUS_LOADING, ADD_LIKE, HAIKU_ERROR } from './constants';
import axios from 'axios';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getHaikus = () => dispatch => {
    dispatch(setHaikusLoading());
    axios
        .get('/haikus/today')
        .then(res =>
            dispatch({
                type: GET_HAIKUS,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const addHaiku = (haiku) => (dispatch, getState) => {
    axios
        .post('/haikus', haiku, tokenConfig(getState))
        .then(res => dispatch({
            type: ADD_HAIKU,
            payload: res.data
        })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status)),
            dispatch({
                type: HAIKU_ERROR
            })
        );

};

export const upVote = (id) => (dispatch, getState) => {
    axios.put(`/haikus/like/${id}`, null, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: ADD_LIKE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
}

export const deleteHaiku = (id) => (dispatch, getState) => {
    axios
        .delete(`/haikus/${id}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_HAIKU,
                payload: id
            })
        )
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
}

export const setHaikusLoading = () => {
    return {
        type: HAIKUS_LOADING
    };
}
