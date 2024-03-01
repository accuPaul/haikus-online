import axiosPrivate  from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import axios from 'axios'

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    
    useEffect(() => {

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['x-auth-token']) {
                    config.headers['x-auth-token'] = `${auth.token}`;
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['x-auth-token'] = `${newAccessToken}`;
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(responseIntercept);
            axios.interceptors.request.eject(requestIntercept);
        }

    }, [auth, refresh])

    return axios;
}

export default useAxiosPrivate;