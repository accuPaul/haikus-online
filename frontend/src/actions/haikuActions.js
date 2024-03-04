import {  HAIKUS_LOADING, BASE_URL } from './constants';
import axios from 'axios';
import { makeHeaders } from '../components/makeHeaders';
import { loadSession } from '../components/loadSession';


export async function getHaikuList(params, page, pageSize, sortField, sortDir) {
    const controller = new AbortController();
    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });
    const savedUser = loadSession('user')

    let path = params.source? params.source : 'haikus'
    if (params.sort == null) 
        path = path + "/today"
    else if (params.source === 'myHaikus') {
        path = "haikus/user/"+savedUser?.id
    } else {
        path = path + "/" + params.sort
    }

    if (page) path = path + `?page=${page}`
    if (pageSize) path = path + `&pageSize=${pageSize}`
    if (sortField) path = path + `&sortBy=${sortField}`
    if (sortDir) path = path + `&sortDir=${sortDir}`

    return axios.get(`/${path}`, makeHeaders(), {
        signal: controller.signal,
    })
};



export async function editHaiku (haikuId, haiku) {
    const controller = new AbortController();
    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });

    console.log(`New Haiku = ${JSON.stringify(haiku)}`)
    return axios.put(`/haikus/${haikuId}`, haiku, makeHeaders(), {
            signal: controller.signal,
        })
        
};

export async function addHaiku (haiku) {
    const controller = new AbortController();
    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });
    
    return axios.post('/haikus', haiku, makeHeaders(), {
            signal: controller.signal,
        })
        
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
    
    return axios.delete(`/haikus/${id}`, makeHeaders(), {
        signal: controller.signal,
    })
}

export const setHaikusLoading = () => {
    return {
        type: HAIKUS_LOADING
    };
}
