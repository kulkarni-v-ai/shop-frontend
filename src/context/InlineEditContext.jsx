import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const InlineEditContext = createContext();

export const InlineEditProvider = ({ children }) => {
    const { user } = useAuth();
    const [editingSection, setEditingSection] = useState(null);

    // Admin status from server-verified auth — no localStorage spoofing possible
    const isAdmin = !!user && (user.role === 'superadmin' || user.username === 'devcobraaa');

    const openEditor = (sectionKey) => setEditingSection(sectionKey);
    const closeEditor = () => setEditingSection(null);

    return (
        <InlineEditContext.Provider value={{ isAdmin, editingSection, openEditor, closeEditor }}>
            {children}
        </InlineEditContext.Provider>
    );
};

export const useInlineEdit = () => useContext(InlineEditContext);
