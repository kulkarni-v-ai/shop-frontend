import { useInlineEdit } from '../context/InlineEditContext';
import '../styles/InlineEdit.css';

const sectionLabels = {
    hero: 'Hero',
    services: 'Services',
    portfolio: 'Portfolio',
    statistics: 'Statistics',
    shop: 'Shop Highlight',
    cta: 'Call to Action',
};

function EditableSection({ sectionKey, children }) {
    const { isAdmin, openEditor, editingSection } = useInlineEdit();

    if (!isAdmin) {
        return children;
    }

    return (
        <div className={`editable-section ${editingSection === sectionKey ? 'editable-section--active' : ''}`}>
            {children}
            <button
                className="editable-section__btn"
                onClick={(e) => {
                    e.stopPropagation();
                    openEditor(sectionKey);
                }}
                title={`Edit ${sectionLabels[sectionKey] || sectionKey}`}
                aria-label={`Edit ${sectionLabels[sectionKey] || sectionKey}`}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 3.5L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="editable-section__btn-label">{sectionLabels[sectionKey]}</span>
            </button>
        </div>
    );
}

export default EditableSection;
