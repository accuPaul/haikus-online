import axios from "axios";
import { makeHeaders } from "../components/makeHeaders";
const BASE_URL = 'http://localhost:5000'

export async function getUserList() {
    const controller = new AbortController();

    axios.create({
        baseURL: BASE_URL,
        withCredentials: true
    });

    return axios.get("/users", makeHeaders(), {
        signal: controller.signal,
    });
}

