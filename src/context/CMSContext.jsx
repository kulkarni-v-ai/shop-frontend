import { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../adminApi';

// Default content — used as fallback when server is unreachable
const defaultCMSData = {
    hero: {
        tag: "Creative Agency & Shop",
        titleLine1: "HOUSE",
        titleLine2: "OF",
        titleLine3: "VISUALS",
        subtitle: "Creative growth and marketing house."
    },
    services: [
        {
            title: 'House of Media',
            items: ['Content Creation', 'Video Campaigns', 'Storytelling'],
        },
        {
            title: 'House of Vision',
            items: ['SEO', 'Meta Ads', 'Performance Marketing', 'Growth Strategy'],
        },
        {
            title: 'House of Art',
            items: ['Brand Visuals', 'Design Systems', 'Creative Direction'],
        },
        {
            title: 'Management',
            items: ['Social Media Handling', 'Brand Consulting'],
        },
    ],
    portfolio: [
        { id: 1, category: 'Ad Creatives', title: 'Lux Campaign', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200', span: 'wide' },
        { id: 2, category: 'Reels', title: 'Motion Series', img: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200', span: 'tall' },
        { id: 3, category: 'Campaign Visuals', title: 'Brand Elevation', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200', span: 'normal' },
        { id: 4, category: 'Brand Identity', title: 'Visual System', img: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=1200', span: 'normal' },
        { id: 5, category: 'Ad Creatives', title: 'Product Launch', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200', span: 'normal' },
        { id: 6, category: 'Campaign Visuals', title: 'Growth Drive', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', span: 'wide' },
        { id: 7, category: 'Reels', title: 'Story Reel', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200', span: 'normal' },
        { id: 8, category: 'Brand Identity', title: 'Identity Craft', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200', span: 'tall' },
    ],
    statistics: [
        { value: "10M+", label: "Views" },
        { value: "5X", label: "ROAS" },
        { value: "200+", label: "Campaigns" },
        { value: "50+", label: "Brands" },
    ],
    shopHighlight: {
        tag: "Shop Internet Culture",
        title1: "Wear The",
        title2: "Vision."
    },
    cta: {
        titleLine1: "READY TO",
        titleLine2: "BE SEEN?"
    }
};

const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
    const [cmsData, setCmsData] = useState(() => {
        // Use localStorage as fast client cache
        const saved = localStorage.getItem('hov_cms_data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultCMSData;
            }
        }
        return defaultCMSData;
    });

    // Fetch CMS data from server on mount
    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const { data } = await adminApi.get('/api/cms');
                setCmsData(data);
                localStorage.setItem('hov_cms_data', JSON.stringify(data));
            } catch (err) {
                console.warn('CMS fetch failed, using cached/default data:', err.message);
            }
        };
        fetchCMS();
    }, []);

    // Sync to localStorage whenever cmsData changes
    useEffect(() => {
        localStorage.setItem('hov_cms_data', JSON.stringify(cmsData));
    }, [cmsData]);

    const updateSection = async (sectionKey, data) => {
        // Optimistic update for instant UI response
        setCmsData(prev => ({
            ...prev,
            [sectionKey]: data
        }));

        // Persist to server (requires admin auth — will fail silently if not authed)
        try {
            await adminApi.put('/api/cms', { [sectionKey]: data });
        } catch (err) {
            console.warn('CMS server save failed:', err.message);
            // The optimistic update stays — data is still in localStorage
        }
    };

    return (
        <CMSContext.Provider value={{ cmsData, updateSection }}>
            {children}
        </CMSContext.Provider>
    );
};

export const useCMS = () => useContext(CMSContext);
