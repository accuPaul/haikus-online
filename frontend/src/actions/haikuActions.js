import { GET_HAIKUS, ADD_HAIKU, DELETE_HAIKU, HAIKUS_LOADING, ADD_LIKE, HAIKU_ERROR, BASE_URL } from './constants';
import axios from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState, useEffect } from 'react'
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import useAuth from '../hooks/useAuth'
import { makeHeaders } from '../components/makeHeaders';

export function useGetHaikus() {
    const setHaikuList = useState();
    const setErrorMessage = useState();
    const axios = useAxiosPrivate();

    useEffect(() => {
        const getList = async () => {
            try {
                const response = await axios.get('/haikus/today');

                setHaikuList(response.data)
                
                .catch(err =>
                    setErrorMessage(err.response?.data?.message)
                );
            } catch (err) {
                setErrorMessage(err.response.data)
            }
        }

        getList();
    }, [])

    
};

export const getHaikuList = (listType) => async () => {
    const axios = useAxiosPrivate();
    const auth = useAuth();
    if (listType?.includes('user')) listType += auth.id
    axios
        .get(`/${listType}`)
        .then(res => { return res.data})
        .catch(err =>
            { throw(err) }
        );
};



export const addHaiku = (haiku) => (dispatch, getState) => {
    const axios = useAxiosPrivate();
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

export async function upVote(id) {
    const controller = new AbortController();
    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });
    
    return axios.put(`/haikus/like/${id}`, {}, makeHeaders(), {
        signal: controller.signal,
    })
}

export async function deleteHaiku(id) {
    const controller = new AbortController();
    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });
    
    console.log(`Calling like endpoint ${JSON.stringify(axios)}`)
    return axios.delete(`/haikus/${id}`, makeHeaders(), {
        signal: controller.signal,
    })
}

export const setHaikusLoading = () => {
    return {
        type: HAIKUS_LOADING
    };
}
