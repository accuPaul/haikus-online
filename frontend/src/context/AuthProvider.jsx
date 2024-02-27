import { createContext, useState } from "react";
import { loadSession } from "../components/loadSession";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(loadSession('user'));
    const [ persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) ||
    false)

    return (
        <AuthContext.Provider value={ { auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;