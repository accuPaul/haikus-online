import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { loadSession } from "./loadSession";

const RequireAuth = (adminOnly) => {
    const { auth } = useAuth(() => loadSession('user'));
    const location = useLocation();

    return (
        (auth?.isAdmin && adminOnly) || !adminOnly
        ? <Outlet />
        : auth?.token 
            ? <Navigate to="/unauthorized" state={{ from: location}} replace />
            : <Navigate to="/login" state={{ from: location}} replace />
    )
}

export default RequireAuth;