// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};