import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import AdminLogin from '../AdminLogin';
import AdminOrders from '../AdminOrders';
import AdminPageEditor from './AdminPageEditor';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Admin.css';

function AdminLayout() {
    const { isAuthenticated, adminUser, loading, logout } = useAdminAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = () => {
        navigate('/admin/dashboard');
    };

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const userRole = adminUser?.role || 'manager';

    // Map backend roles to display labels
    const roleLabels = {
        superadmin: 'Super Admin',
        admin: 'Admin',
        manager: 'Manager',
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span className="eye-mark"></span>
                    <h2>HOV ADMIN</h2>
                    <span className="admin-role-badge">{roleLabels[userRole] || userRole}</span>
                </div>
                <nav className="admin-nav">
                    <Link
                        to="/admin/dashboard"
                        className={`admin-nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                    >
                        📦 Orders
                    </Link>
                    <Link
                        to="/admin/page-editor"
                        className={`admin-nav-link ${location.pathname === '/admin/page-editor' ? 'active' : ''}`}
                    >
                        📝 Page Editor
                    </Link>
                    {userRole === 'superadmin' && (
                        <>
                            <Link
                                to="/admin/layout"
                                className={`admin-nav-link ${location.pathname === '/admin/layout' ? 'active' : ''}`}
                            >
                                📐 Layout Settings
                            </Link>
                            <Link
                                to="/admin/users"
                                className={`admin-nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}
                            >
                                👥 Manage Users
                            </Link>
                        </>
                    )}
                </nav>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    Sign Out
                </button>
            </aside>
            <main className="admin-main">
                <Routes>
                    <Route path="/dashboard" element={
                        <ProtectedRoute requiredRoles={["superadmin", "admin", "manager"]}>
                            <AdminOrders />
                        </ProtectedRoute>
                    } />
                    <Route path="/page-editor" element={
                        <ProtectedRoute requiredRoles={["superadmin", "admin"]}>
                            <AdminPageEditor userRole={userRole} />
                        </ProtectedRoute>
                    } />
                    <Route path="/layout" element={
                        <ProtectedRoute requiredRoles={["superadmin"]}>
                            <h2 style={{ padding: '40px' }}>📐 Layout Settings (Super Admin Only)</h2>
                        </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                        <ProtectedRoute requiredRoles={["superadmin"]}>
                            <h2 style={{ padding: '40px' }}>👥 Manage Users (Super Admin Only)</h2>
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default AdminLayout;
