import axios from "axios";
import useAuth from "./useAuth";
import { loadSession } from "../components/loadSession";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth(() => loadSession('user'));

    const refresh = async () => {
        const savedUser = auth?.token ? auth : loadSession('user')
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        };
        if (savedUser?.token) config.headers['x-auth-token'] = savedUser.token;

        const response = await axios.get('/auth/refresh', config, {
            withCredentials: true
        });

        setAuth(prev => {
            savedUser.token = response.data.token
            window.sessionStorage.setItem('user',JSON.stringify(savedUser))
            return { ...prev, token: response.data.token}
        });
        return response.data.token;
    }
    return refresh;
}

export default useRefreshToken;