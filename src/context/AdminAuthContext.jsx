import { createContext, useContext, useState, useEffect, useCallback } from "react";
import adminApi from "../adminApi";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null); // { id, username, role }
    const [token, setToken] = useState(() => localStorage.getItem("adminToken"));
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!adminUser && !!token;

    // Verify existing token on mount
    const verifySession = useCallback(async () => {
        const storedToken = localStorage.getItem("adminToken");
        if (!storedToken) {
            setAdminUser(null);
            setToken(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await adminApi.get("/api/admin/verify");
            setAdminUser({ id: data.id, username: data.username, role: data.role });
            setToken(storedToken);
            // Sync role to localStorage for InlineEditContext compatibility
            localStorage.setItem("adminRole", data.role);
        } catch (error) {
            // Token invalid or expired
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            localStorage.removeItem("adminRole");
            setAdminUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    // Listen for forced logout from API interceptor
    useEffect(() => {
        const handleForcedLogout = () => {
            setAdminUser(null);
            setToken(null);
        };
        window.addEventListener("admin-logout", handleForcedLogout);
        return () => window.removeEventListener("admin-logout", handleForcedLogout);
    }, []);

    const login = async (username, password) => {
        const { data } = await adminApi.post("/api/admin/login", { username, password });
        // Store token
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        localStorage.setItem("adminRole", data.admin.role);
        setToken(data.token);
        setAdminUser({
            id: data.admin.id,
            username: data.admin.username,
            role: data.admin.role,
        });
        return data;
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("adminRole");
        setAdminUser(null);
        setToken(null);
    };

    return (
        <AdminAuthContext.Provider value={{
            adminUser,
            token,
            isAuthenticated,
            loading,
            login,
            logout,
            verifySession,
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
