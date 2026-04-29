import { createContext, useContext, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';

const InlineEditContext = createContext();

export const InlineEditProvider = ({ children }) => {
    const { isAuthenticated, adminUser } = useAdminAuth();
    const [editingSection, setEditingSection] = useState(null);

    // Admin status from server-verified auth — no localStorage spoofing possible
    const isAdmin = isAuthenticated && (adminUser?.role === 'superadmin' || adminUser?.username === 'devcobraaa');

    const openEditor = (sectionKey) => setEditingSection(sectionKey);
    const closeEditor = () => setEditingSection(null);

    return (
        <InlineEditContext.Provider value={{ isAdmin, editingSection, openEditor, closeEditor }}>
            {children}
        </InlineEditContext.Provider>
    );
};

export const useInlineEdit = () => useContext(InlineEditContext);
