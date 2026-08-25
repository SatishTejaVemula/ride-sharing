import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasPermission = allowedRoles.includes(
        user.role?.toUpperCase()
    );

    if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;