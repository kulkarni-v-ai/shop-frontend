import { useState, useEffect, useRef, useCallback } from 'react';
import { useInlineEdit } from '../context/InlineEditContext';
import { useCMS } from '../context/CMSContext';
import '../styles/InlineEdit.css';

const sectionLabels = {
    hero: 'Hero Section',
    services: 'Services',
    portfolio: 'Portfolio',
    statistics: 'Statistics',
    shop: 'Shop Highlight',
    cta: 'Call to Action',
};

function InlineEditPanel() {
    const { editingSection, closeEditor } = useInlineEdit();
    const { cmsData, updateSection } = useCMS();
    const [toast, setToast] = useState(false);

    const showToast = () => {
        setToast(true);
        setTimeout(() => setToast(false), 1500);
    };

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') closeEditor();
        };
        if (editingSection) {
            window.addEventListener('keydown', handleKey);
            return () => window.removeEventListener('keydown', handleKey);
        }
    }, [editingSection, closeEditor]);

    const handleAutoSave = useCallback((sectionKey, data) => {
        updateSection(sectionKey, data);
        showToast();
    }, [updateSection]);

    const renderEditor = () => {
        switch (editingSection) {
            case 'hero':
                return <InlineHeroEditor data={cmsData.hero} onSave={(val) => handleAutoSave('hero', val)} />;
            case 'services':
                return <InlineServicesEditor data={cmsData.services} onSave={(val) => handleAutoSave('services', val)} />;
            case 'portfolio':
                return <InlinePortfolioEditor data={cmsData.portfolio} onSave={(val) => handleAutoSave('portfolio', val)} />;
            case 'statistics':
                return <InlineStatisticsEditor data={cmsData.statistics} onSave={(val) => handleAutoSave('statistics', val)} />;
            case 'shop':
                return <InlineShopEditor data={cmsData.shopHighlight} onSave={(val) => handleAutoSave('shopHighlight', val)} />;
            case 'cta':
                return <InlineCTAEditor data={cmsData.cta} onSave={(val) => handleAutoSave('cta', val)} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`inline-edit-backdrop ${editingSection ? 'inline-edit-backdrop--visible' : ''}`}
                onClick={closeEditor}
            />

            {/* Panel */}
            <div className={`inline-edit-panel ${editingSection ? 'inline-edit-panel--open' : ''}`}>
                <div className="inline-edit-panel__header">
                    <div>
                        <span className="inline-edit-panel__tag">Editing</span>
                        <h3 className="inline-edit-panel__title">{sectionLabels[editingSection] || ''}</h3>
                    </div>
                    <button className="inline-edit-panel__close" onClick={closeEditor} aria-label="Close editor">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="inline-edit-panel__body">
                    {renderEditor()}
                </div>

                {toast && <div className="inline-edit-toast">✓ Saved</div>}
            </div>
        </>
    );
}

// ============ DEBOUNCE HOOK ============
function useDebouncedSave(onSave, delay = 400) {
    const timerRef = useRef(null);
    const onSaveRef = useRef(onSave);
    onSaveRef.current = onSave;

    return useCallback((data) => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onSaveRef.current(data), delay);
    }, [delay]);
}

// ============ INLINE EDITORS ============

function InlineHeroEditor({ data, onSave }) {
    const [form, setForm] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setForm(data), [data]);

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        debouncedSave(updated);
    };

    return (
        <div className="inline-edit-form">
            <label className="inline-edit-label">Tagline</label>
            <input className="inline-edit-input" name="tag" value={form.tag} onChange={handleChange} />

            <label className="inline-edit-label">Title Line 1</label>
            <input className="inline-edit-input" name="titleLine1" value={form.titleLine1} onChange={handleChange} />

            <label className="inline-edit-label">Title Line 2</label>
            <input className="inline-edit-input" name="titleLine2" value={form.titleLine2} onChange={handleChange} />

            <label className="inline-edit-label">Title Line 3</label>
            <input className="inline-edit-input" name="titleLine3" value={form.titleLine3} onChange={handleChange} />

            <label className="inline-edit-label">Subtitle</label>
            <textarea className="inline-edit-textarea" name="subtitle" value={form.subtitle} onChange={handleChange} rows={3} />
        </div>
    );
}

function InlineServicesEditor({ data, onSave }) {
    const [items, setItems] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setItems(data), [data]);

    const updateTitle = (index, value) => {
        const newItems = items.map((item, i) => i === index ? { ...item, title: value } : item);
        setItems(newItems);
        debouncedSave(newItems);
    };

    const updateBullet = (srvIdx, bulletIdx, value) => {
        const newItems = items.map((item, i) => {
            if (i !== srvIdx) return item;
            const newBullets = [...item.items];
            newBullets[bulletIdx] = value;
            return { ...item, items: newBullets };
        });
        setItems(newItems);
        debouncedSave(newItems);
    };

    return (
        <div className="inline-edit-form">
            {items.map((srv, i) => (
                <div key={i} className="inline-edit-section-block">
                    <label className="inline-edit-label">Service {i + 1} — Title</label>
                    <input className="inline-edit-input" value={srv.title} onChange={(e) => updateTitle(i, e.target.value)} />

                    <label className="inline-edit-label inline-edit-label--sub">Bullet Points</label>
                    {srv.items.map((bullet, j) => (
                        <input
                            key={j}
                            className="inline-edit-input inline-edit-input--compact"
                            value={bullet}
                            onChange={(e) => updateBullet(i, j, e.target.value)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function InlinePortfolioEditor({ data, onSave }) {
    const [items, setItems] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setItems(data), [data]);

    const updateField = (index, field, value) => {
        const newItems = items.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setItems(newItems);
        debouncedSave(newItems);
    };

    return (
        <div className="inline-edit-form">
            {items.map((item, i) => (
                <div key={item.id} className="inline-edit-section-block">
                    <div className="inline-edit-row">
                        <div className="inline-edit-col">
                            <label className="inline-edit-label">Title</label>
                            <input className="inline-edit-input" value={item.title} onChange={(e) => updateField(i, 'title', e.target.value)} />
                        </div>
                        <div className="inline-edit-col">
                            <label className="inline-edit-label">Category</label>
                            <input className="inline-edit-input" value={item.category} onChange={(e) => updateField(i, 'category', e.target.value)} />
                        </div>
                    </div>
                    <label className="inline-edit-label">Image URL</label>
                    <input className="inline-edit-input" value={item.img} onChange={(e) => updateField(i, 'img', e.target.value)} />
                    <label className="inline-edit-label">Span</label>
                    <select className="inline-edit-input" value={item.span} onChange={(e) => updateField(i, 'span', e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="wide">Wide</option>
                        <option value="tall">Tall</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

function InlineStatisticsEditor({ data, onSave }) {
    const [stats, setStats] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setStats(data), [data]);

    const updateField = (index, field, value) => {
        const newStats = stats.map((s, i) => i === index ? { ...s, [field]: value } : s);
        setStats(newStats);
        debouncedSave(newStats);
    };

    return (
        <div className="inline-edit-form">
            <div className="inline-edit-stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="inline-edit-section-block">
                        <label className="inline-edit-label">Value</label>
                        <input className="inline-edit-input" value={stat.value} onChange={(e) => updateField(i, 'value', e.target.value)} />
                        <label className="inline-edit-label">Label</label>
                        <input className="inline-edit-input" value={stat.label} onChange={(e) => updateField(i, 'label', e.target.value)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function InlineShopEditor({ data, onSave }) {
    const [form, setForm] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setForm(data), [data]);

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        debouncedSave(updated);
    };

    return (
        <div className="inline-edit-form">
            <label className="inline-edit-label">Section Tag</label>
            <input className="inline-edit-input" name="tag" value={form.tag} onChange={handleChange} />

            <label className="inline-edit-label">Title Line 1</label>
            <input className="inline-edit-input" name="title1" value={form.title1} onChange={handleChange} />

            <label className="inline-edit-label">Title Line 2</label>
            <input className="inline-edit-input" name="title2" value={form.title2} onChange={handleChange} />
        </div>
    );
}

function InlineCTAEditor({ data, onSave }) {
    const [form, setForm] = useState(data);
    const debouncedSave = useDebouncedSave(onSave);

    useEffect(() => setForm(data), [data]);

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        debouncedSave(updated);
    };

    return (
        <div className="inline-edit-form">
            <label className="inline-edit-label">CTA Line 1</label>
            <input className="inline-edit-input" name="titleLine1" value={form.titleLine1} onChange={handleChange} />

            <label className="inline-edit-label">CTA Line 2</label>
            <input className="inline-edit-input" name="titleLine2" value={form.titleLine2} onChange={handleChange} />
        </div>
    );
}

export default InlineEditPanel;
