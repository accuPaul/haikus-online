import axios from "axios";
import { loadSession } from "../components/loadSession";

class MyAxios {
    constructor() {
        this.savedUser = loadSession('user');
        this.BASE_URL = "http://localhost:5000";

        this.axiosPrivate = axios.create({
            baseURL: this.BASE_URL,
            withCredentials: true
        });
    }

    makeConfig() {
        
    }
   
    fetchUsers() {
        return this.axiosPrivate.get("/users", this.makeConfig())
    } 
}
let instance = MyAxios | null;

export function useMyAxios() {
    if (!instance) instance = new MyAxios();
    return instance;
}

export default MyAxios;