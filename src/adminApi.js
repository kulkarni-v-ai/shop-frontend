import axios from "axios";

const adminApi = axios.create({
    baseURL: "https://shop-backend-yvk4.onrender.com",
});

// Request interceptor: attach admin JWT token
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 (expired/invalid token)
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear stored auth data on unauthorized
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");
            localStorage.removeItem("adminRole");
            // Dispatch custom event so AdminAuthContext can react
            window.dispatchEvent(new Event("admin-logout"));
        }
        return Promise.reject(error);
    }
);

export default adminApi;
