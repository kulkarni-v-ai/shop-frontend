import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function ProtectedRoute({ children, requiredRoles }) {
    const { isAuthenticated, adminUser, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
            }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    if (requiredRoles && requiredRoles.length > 0) {
        if (!adminUser || !requiredRoles.includes(adminUser.role)) {
            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "40vh",
                    color: "#fff",
                    gap: "16px",
                }}>
                    <h2 style={{ fontSize: "1.5rem", color: "#d4af37" }}>🔒 Access Denied</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)" }}>
                        You do not have permission to view this page.
                    </p>
                </div>
            );
        }
    }

    return children;
}

export default ProtectedRoute;
