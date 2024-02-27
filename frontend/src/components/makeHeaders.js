import { loadSession } from "./loadSession";

export function makeHeaders() {
    const savedUser = loadSession('user')
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    if (savedUser?.token) config.headers['x-auth-token'] = savedUser.token;
    return config
}