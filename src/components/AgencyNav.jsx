import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgencyNav.css';

const AgencyNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();
    const navRef = useRef(null);

    const menuItems = [
        { label: 'Who We Are', target: '#who-we-are' },
        { label: 'Services', target: '.agency-services' },
        { label: 'Work', target: '.agency-portfolio' },
        { label: 'Shop', action: () => navigate('/shop') },
        { label: 'Why Us', target: '#why-us' },
        { label: 'Contact', target: '.agency-contact' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            // Shrink after 80px scroll
            setScrolled(window.scrollY > 80);

            // Scroll progress
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            setScrollProgress(Math.min(progress, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (item) => {
        if (item.action) {
            item.action();
            return;
        }
        const el = document.querySelector(item.target);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`agency-nav ${scrolled ? 'agency-nav--scrolled' : ''}`} ref={navRef}>
            {/* Scroll Progress Bar */}
            <div className="nav-progress" style={{ width: `${scrollProgress}%` }} />

            <div className="agency-nav__inner">
                {/* Logo */}
                <div className="agency-nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src="/logo.png" alt="HOV" style={{ height: '32px', width: 'auto', borderRadius: '50%', marginRight: '8px' }} />
                    <span className="eye-mark"></span>
                    <span className="agency-nav__logo-text">HOV</span>
                </div>

                {/* Menu Items */}
                <ul className="agency-nav__menu">
                    {menuItems.map((item, i) => (
                        <li
                            key={i}
                            className={`agency-nav__item ${activeItem === i ? 'agency-nav__item--active' : ''}`}
                            onClick={() => { setActiveItem(i); handleClick(item); }}
                            onMouseEnter={() => setActiveItem(i)}
                            onMouseLeave={() => setActiveItem(null)}
                        >
                            <span className="agency-nav__link">
                                {item.label}
                                <span className="agency-nav__underline" />
                            </span>
                            <span className="agency-nav__glow" />
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button className="agency-nav__cta" onClick={() => {
                    const el = document.querySelector('.agency-contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                    Let's Talk
                </button>
            </div>
        </nav>
    );
};

export default AgencyNav;
