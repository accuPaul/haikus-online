import { GET_HAIKUS, ADD_HAIKU, DELETE_HAIKU, HAIKUS_LOADING } from './constants';
import axios from 'axios';

export const getHaikus = () => dispatch => {
    dispatch(setHaikusLoading());
    axios
        .get('/haikus')
        .then(res =>
            dispatch({
                type: GET_HAIKUS,
                payload: res.data
            })
        );
};

export const addHaiku = (haiku) => dispatch => {
    axios
        .post('/haikus', haiku)
        .then(res => dispatch({
            type: ADD_HAIKU,
            payload: res.data
        }))
        .catch(err => console.log(`Error saving: ${err.message}`))

};

export const deleteHaiku = (id) => dispatch => {
    axios
        .delete(`/haikus/${id}`)
        .then(res =>
            dispatch({
                type: DELETE_HAIKU,
                payload: id
            }))
}

export const setHaikusLoading = () => {
    return {
        type: HAIKUS_LOADING
    };
}
