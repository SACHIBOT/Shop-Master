import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    if (!loading) {
        if (isAuthenticated) {
            return (
                <Outlet />
            )
        } else {
            return <Navigate to="/login" />

        }
    }
}

export default ProtectedRoute