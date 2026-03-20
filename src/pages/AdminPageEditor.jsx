import { useState } from 'react';
import { useCMS } from '../context/CMSContext';

function AdminPageEditor() {
    const { cmsData, updateSection } = useCMS();
    const [activeTab, setActiveTab] = useState('hero');
    const [savedPopup, setSavedPopup] = useState(false);

    const handleSave = (sectionStr, newData) => {
        updateSection(sectionStr, newData);
        setSavedPopup(true);
        setTimeout(() => setSavedPopup(false), 2000);
    };

    const renderEditor = () => {
        switch (activeTab) {
            case 'hero':
                return <HeroEditor data={cmsData.hero} onSave={(val) => handleSave('hero', val)} />;
            case 'services':
                return <ServicesEditor data={cmsData.services} onSave={(val) => handleSave('services', val)} />;
            case 'portfolio':
                return <PortfolioEditor data={cmsData.portfolio} onSave={(val) => handleSave('portfolio', val)} />;
            case 'statistics':
                return <StatisticsEditor data={cmsData.statistics} onSave={(val) => handleSave('statistics', val)} />;
            case 'shop':
                return <ShopEditor data={cmsData.shopHighlight} onSave={(val) => handleSave('shopHighlight', val)} />;
            case 'cta':
                return <CTAEditor data={cmsData.cta} onSave={(val) => handleSave('cta', val)} />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-page-editor">
            <div className="admin-editor-header">
                <h2>Landing Page Editor</h2>
                <div className="admin-tabs">
                    <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Hero</button>
                    <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>Services</button>
                    <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
                    <button className={activeTab === 'statistics' ? 'active' : ''} onClick={() => setActiveTab('statistics')}>Statistics</button>
                    <button className={activeTab === 'shop' ? 'active' : ''} onClick={() => setActiveTab('shop')}>Shop Section</button>
                    <button className={activeTab === 'cta' ? 'active' : ''} onClick={() => setActiveTab('cta')}>CTA Section</button>
                </div>
            </div>

            <div className="admin-editor-content">
                {renderEditor()}
            </div>

            {savedPopup && <div className="admin-toast">✅ Changes Saved Live!</div>}
        </div>
    );
}

// ------ SECTION EDITORS ------

function HeroEditor({ data, onSave }) {
    const [formData, setFormData] = useState(data);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const submit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form className="admin-form" onSubmit={submit}>
            <div className="admin-form-group">
                <label>Top Tagline</label>
                <input type="text" name="tag" value={formData.tag} onChange={handleChange} />
            </div>
            <div className="admin-form-row">
                <div className="admin-form-group"><label>Title Line 1</label><input type="text" name="titleLine1" value={formData.titleLine1} onChange={handleChange} /></div>
                <div className="admin-form-group"><label>Title Line 2</label><input type="text" name="titleLine2" value={formData.titleLine2} onChange={handleChange} /></div>
                <div className="admin-form-group"><label>Title Line 3</label><input type="text" name="titleLine3" value={formData.titleLine3} onChange={handleChange} /></div>
            </div>
            <div className="admin-form-group">
                <label>Subtitle</label>
                <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} rows={3} />
            </div>
            <button type="submit" className="admin-save-btn">Save Hero Content</button>
        </form>
    );
}

function ServicesEditor({ data, onSave }) {
    const [items, setItems] = useState(data);

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const updateBullet = (serviceIndex, bulletIndex, value) => {
        const newItems = [...items];
        newItems[serviceIndex].items[bulletIndex] = value;
        setItems(newItems);
    };

    const submit = (e) => { e.preventDefault(); onSave(items); };

    return (
        <form className="admin-form" onSubmit={submit}>
            {items.map((srv, i) => (
                <div key={i} className="admin-list-item">
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Service Title {i + 1}</label>
                            <input type="text" value={srv.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Bullet Points (comma separated internally)</label>
                        {srv.items.map((bullet, j) => (
                            <input key={j} type="text" value={bullet} onChange={(e) => updateBullet(i, j, e.target.value)} style={{ marginBottom: '8px' }} />
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit" className="admin-save-btn">Save Services</button>
        </form>
    );
}

function PortfolioEditor({ data, onSave }) {
    const [items, setItems] = useState(data);

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const submit = (e) => { e.preventDefault(); onSave(items); };

    return (
        <form className="admin-form" onSubmit={submit}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Note: Edits apply instantly but layout needs 8 items for optimal desktop grid.</p>
            {items.map((item, i) => (
                <div key={item.id} className="admin-list-item">
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Title</label>
                            <input type="text" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Category</label>
                            <input type="text" value={item.category} onChange={(e) => updateItem(i, 'category', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Grid Span</label>
                            <select value={item.span} onChange={(e) => updateItem(i, 'span', e.target.value)}>
                                <option value="normal">Normal (1x1)</option>
                                <option value="wide">Wide (2x1)</option>
                                <option value="tall">Tall (1x2)</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Image URL</label>
                        <input type="text" value={item.img} onChange={(e) => updateItem(i, 'img', e.target.value)} />
                    </div>
                </div>
            ))}
            <button type="submit" className="admin-save-btn">Save Portfolio</button>
        </form>
    );
}

function StatisticsEditor({ data, onSave }) {
    const [stats, setStats] = useState(data);
    const updateStat = (i, field, value) => {
        const newStats = [...stats];
        newStats[i][field] = value;
        setStats(newStats);
    };
    const submit = (e) => { e.preventDefault(); onSave(stats); };

    return (
        <form className="admin-form" onSubmit={submit}>
            <div className="admin-form-row">
                {stats.map((stat, i) => (
                    <div key={i} className="admin-list-item" style={{ flex: '1' }}>
                        <div className="admin-form-group">
                            <label>Stat {i + 1} Value (e.g. 10M+)</label>
                            <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Label</label>
                            <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>
            <button type="submit" className="admin-save-btn">Save Statistics</button>
        </form>
    );
}

function ShopEditor({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const submit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form className="admin-form" onSubmit={submit}>
            <div className="admin-form-group">
                <label>Section Tag</label>
                <input type="text" name="tag" value={formData.tag} onChange={handleChange} />
            </div>
            <div className="admin-form-row">
                <div className="admin-form-group">
                    <label>Title Line 1</label>
                    <input type="text" name="title1" value={formData.title1} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                    <label>Title Line 2</label>
                    <input type="text" name="title2" value={formData.title2} onChange={handleChange} />
                </div>
            </div>
            <button type="submit" className="admin-save-btn">Save Shop Highlight</button>
        </form>
    );
}

function CTAEditor({ data, onSave }) {
    const [formData, setFormData] = useState(data);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const submit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form className="admin-form" onSubmit={submit}>
            <div className="admin-form-row">
                <div className="admin-form-group">
                    <label>CTA Line 1</label>
                    <input type="text" name="titleLine1" value={formData.titleLine1} onChange={handleChange} />
                </div>
                <div className="admin-form-group">
                    <label>CTA Line 2</label>
                    <input type="text" name="titleLine2" value={formData.titleLine2} onChange={handleChange} />
                </div>
            </div>
            <button type="submit" className="admin-save-btn">Save CTA</button>
        </form>
    );
}

export default AdminPageEditor;

