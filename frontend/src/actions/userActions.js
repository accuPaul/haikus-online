import axios from "axios";
import { makeHeaders } from "../components/makeHeaders";
import { BASE_URL } from "../actions/constants"

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

