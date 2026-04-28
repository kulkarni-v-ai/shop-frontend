import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import CinematicIntro from '../components/CinematicIntro';
import AgencyNav from '../components/AgencyNav';
import EditableSection from '../components/EditableSection';
import InlineEditPanel from '../components/InlineEditPanel';
import { useAuth } from '../context/AuthContext';
import { useCMS } from '../context/CMSContext';
import { getProducts } from '../api';
import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const revealRefs = useRef([]);
    const heroRef = useRef(null);
    const glowRef = useRef(null);
    const spotlightRef = useRef(null);
    const [introComplete, setIntroComplete] = useState(() => {
        return sessionStorage.getItem('hovIntroPlayed') === 'true';
    });
    const [shopProducts, setShopProducts] = useState([]);

    // Connect to CMS Data
    const { cmsData } = useCMS();
    const { hero, services, portfolio, statistics, shopHighlight, cta } = cmsData;

    // Fetch shop products for the Shop Internet Culture section
    useEffect(() => {
        getProducts()
            .then(res => setShopProducts(res.data || []))
            .catch(err => console.error("Failed to fetch shop highlight products:", err));
    }, []);

    // Scroll reveal logic
    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    // Global cursor spotlight + parallax + interactive gradients
    useEffect(() => {
        let mouseX = 0, mouseY = 0, spotX = 0, spotY = 0;
        let rafId;
        const lerp = (a, b, t) => a + (b - a) * t;
        let pupilX = 0, pupilY = 0;

        const animateSpotlight = () => {
            spotX = lerp(spotX, mouseX, 0.08);
            spotY = lerp(spotY, mouseY, 0.08);
            if (spotlightRef.current) {
                spotlightRef.current.style.transform = `translate(${spotX - 200}px, ${spotY - 200}px)`;
            }
            rafId = requestAnimationFrame(animateSpotlight);
        };
        rafId = requestAnimationFrame(animateSpotlight);

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Cursor glow
            if (glowRef.current) {
                glowRef.current.style.left = e.clientX + 'px';
                glowRef.current.style.top = e.clientY + 'px';
            }
            // Parallax on blob
            const blob = document.querySelector('.hero-blob');
            if (blob && heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                blob.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
            }
            // Interactive gradient on sections with .gradient-interact
            document.querySelectorAll('.gradient-interact').forEach(el => {
                const rect = el.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                el.style.setProperty('--gx', x + '%');
                el.style.setProperty('--gy', y + '%');
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    // Parallax scroll effect
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    document.querySelectorAll('[data-parallax]').forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.1;
                        const rect = el.getBoundingClientRect();
                        const offset = (rect.top + scrollY) - scrollY;
                        el.style.transform = `translateY(${offset * speed * -0.15}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((ref) => observer.observe(ref));

        return () => {
            revealRefs.current.forEach((ref) => observer.unobserve(ref));
        };
    }, [introComplete]);

    return (
        <div className="landing-page smooth-scroll">
            {/* Global cursor spotlight */}
            <div className="cursor-spotlight" ref={spotlightRef} />
            {/* Cursor Glow */}
            <div className="cursor-glow" ref={glowRef} />
            {/* Global background particles */}
            <div className="global-particles" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div className="g-particle" key={i} style={{
                        left: `${5 + Math.random() * 90}%`,
                        animationDuration: `${8 + Math.random() * 12}s`,
                        animationDelay: `${Math.random() * 8}s`,
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                        opacity: 0.15 + Math.random() * 0.2,
                    }} />
                ))}
            </div>

            {/* Premium Agency Navigation */}
            <AgencyNav />

            {/* Cinematic Intro */}
            {!introComplete && <CinematicIntro onComplete={() => {
                sessionStorage.setItem('hovIntroPlayed', 'true');
                setIntroComplete(true);
            }} />}

            {/* Hero Section - Split Layout */}
            <EditableSection sectionKey="hero">
                <header className="agency-hero" ref={heroRef}>
                    <div className="hero-split">
                        {/* Left: Typography */}
                        <div className="hero-left">
                            <span className="hero-tag reveal-text" ref={addToRefs}>
                                <span className="eye-mark"></span>{hero.tag}
                            </span>
                            <h1 className="hero-title-agency">
                                <span className="title-line reveal-text" ref={addToRefs}>{hero.titleLine1}</span>
                                <span className="title-line reveal-text" ref={addToRefs}>{hero.titleLine2}</span>
                                <span className="title-line title-outline reveal-text" ref={addToRefs}>{hero.titleLine3}</span>
                            </h1>
                            <p className="hero-subtitle-agency reveal-text" ref={addToRefs}>
                                {hero.subtitle}
                            </p>
                            <div className="hero-btns reveal-text" ref={addToRefs}>
                                <MagneticButton className="btn-primary-agency" onClick={() => window.scrollTo({ top: document.querySelector('.agency-contact').offsetTop, behavior: 'smooth' })}>
                                    Start a Project
                                </MagneticButton>
                                <MagneticButton className="btn-secondary-agency" onClick={() => window.scrollTo({ top: document.querySelector('.agency-portfolio').offsetTop, behavior: 'smooth' })}>
                                    View Work
                                </MagneticButton>
                                <MagneticButton className="btn-tertiary-agency" onClick={() => navigate('/shop')}>
                                    Visit Shop
                                </MagneticButton>
                            </div>
                        </div>

                        {/* Right: Animated Gradient Blob */}
                        <div className="hero-right">
                            <div className="hero-blob">
                                <div className="blob-inner" />
                                <div className="blob-ring" />
                                <div className="blob-ring blob-ring-2" />
                            </div>
                        </div>
                    </div>
                </header>
            </EditableSection>

            <div className="section-transition" />

            {/* WHO WE ARE - Storytelling Section */}
            <section className="agency-who gradient-interact" id="who-we-are">
                {/* Background motion grid */}
                <div className="who-grid" />
                {/* Gradient accent */}
                <div className="who-gradient-accent" />

                <div className="who-content">
                    <div className="who-text">
                        <span className="section-tag reveal" ref={addToRefs}>
                            <span className="eye-mark"></span>About Us
                        </span>
                        <h2 className="who-title reveal" ref={addToRefs}>
                            WHO WE<br />ARE
                        </h2>
                        <p className="who-description reveal" ref={addToRefs}>
                            House of Visuals helps brands grow through powerful visuals, creative storytelling, and performance marketing strategies.
                        </p>
                    </div>

                    <div className="who-highlights">
                        {[
                            { num: '01', title: 'Strategic Thinking', desc: 'We craft thoughtful, data-informed strategies that align with your brand\'s vision and market position.' },
                            { num: '02', title: 'High Quality Visuals', desc: 'Every pixel tells a story. We create cinematic-grade visuals that captivate and convert.' },
                            { num: '03', title: 'Data Driven Growth', desc: 'Performance marketing powered by behavioral analytics and real-time optimization.' },
                        ].map((item, i) => (
                            <div className="who-highlight-card reveal" key={i} ref={addToRefs}>
                                <span className="who-highlight-num">{item.num}</span>
                                <div>
                                    <h3 className="who-highlight-title">{item.title}</h3>
                                    <p className="who-highlight-desc">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-transition" />

            {/* Services Section */}
            <EditableSection sectionKey="services">
                <section className="agency-services">
                    <div className="reveal" ref={addToRefs}>
                        <span className="section-tag">Our Divisions</span>
                        <h2 className="section-title-agency">What We<br /> Build.</h2>
                    </div>
                    <div className="services-grid-new">
                        {services.map((div, index) => {
                            const cardRef = React.createRef();
                            const glowOverlayRef = React.createRef();
                            const handleTiltMove = (e) => {
                                const card = cardRef.current;
                                if (!card) return;
                                const rect = card.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;
                                const rotateX = ((y - centerY) / centerY) * -12;
                                const rotateY = ((x - centerX) / centerX) * 12;
                                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
                                card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0,0,0,0.4)`;
                                if (glowOverlayRef.current) {
                                    glowOverlayRef.current.style.opacity = '1';
                                    glowOverlayRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${div.accent}22 0%, transparent 60%)`;
                                }
                            };
                            const handleTiltLeave = () => {
                                const card = cardRef.current;
                                if (!card) return;
                                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                                card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                                if (glowOverlayRef.current) glowOverlayRef.current.style.opacity = '0';
                            };
                            return (
                                <div
                                    className="tilt-card reveal"
                                    key={index}
                                    ref={(el) => { cardRef.current = el; addToRefs(el); }}
                                    onMouseMove={handleTiltMove}
                                    onMouseLeave={handleTiltLeave}
                                    style={{ '--card-accent': div.accent }}
                                >
                                    <div className="tilt-card__glow" ref={glowOverlayRef} />
                                    <div className="tilt-card__icon">{div.icon || '✨'}</div>
                                    <h3 className="tilt-card__title">{div.title}</h3>
                                    <ul className="tilt-card__list">
                                        {div.items.map((item, j) => (
                                            <li key={j}>{item}</li>
                                        ))}
                                    </ul>
                                    <div className="tilt-card__accent-line" />
                                </div>
                            );
                        })}
                    </div>
                </section>
            </EditableSection>

            <div className="section-transition" />

            {/* Portfolio Section */}
            <EditableSection sectionKey="portfolio">
                <section className="agency-portfolio">
                    <div className="reveal" ref={addToRefs} style={{ marginBottom: '80px' }}>
                        <span className="section-tag">Our Work</span>
                        <h2 className="section-title-agency">Selected<br /> Projects.</h2>
                    </div>
                    <div className="portfolio-dynamic">
                        {portfolio.map((item) => (
                            <div
                                className={`port-item port-item--${item.span} reveal`}
                                key={item.id}
                                ref={addToRefs}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    const spotlight = e.currentTarget.querySelector('.port-spotlight');
                                    const reflection = e.currentTarget.querySelector('.port-reflection');
                                    if (spotlight) spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212,175,55,0.12) 0%, transparent 50%)`;
                                    if (reflection) {
                                        reflection.style.opacity = '1';
                                        reflection.style.background = `linear-gradient(${Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180 / Math.PI}deg, rgba(255,255,255,0.08) 0%, transparent 50%)`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const spotlight = e.currentTarget.querySelector('.port-spotlight');
                                    const reflection = e.currentTarget.querySelector('.port-reflection');
                                    if (spotlight) spotlight.style.background = 'transparent';
                                    if (reflection) reflection.style.opacity = '0';
                                }}
                            >
                                <img src={item.img} alt={item.title} loading="lazy" />
                                <div className="port-spotlight" />
                                <div className="port-reflection" />
                                <div className="port-overlay">
                                    <span className="port-category">{item.category}</span>
                                    <h3 className="port-title">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </EditableSection>

            {/* Proof Section — Animated Counters */}
            <EditableSection sectionKey="statistics">
                <section className="agency-proof">
                    <div className="proof-inner">
                        <div className="reveal" ref={addToRefs}>
                            <span className="section-tag">Impact</span>
                            <h2 className="section-title-agency">Results We<br /> Saw.</h2>
                        </div>
                        <div className="proof-counters">
                            {statistics.map((stat, i) => (
                                <div className="proof-stat reveal" key={i} ref={(el) => {
                                    addToRefs(el);
                                    if (!el) return;
                                    const numEl = el.querySelector('.proof-num');
                                    if (!numEl || numEl.dataset.animated) return;
                                    const obs = new IntersectionObserver(([entry]) => {
                                        if (entry.isIntersecting) {
                                            numEl.dataset.animated = 'true';
                                            const start = performance.now();
                                            const duration = 2000;
                                            const target = stat.value;
                                            const tick = (now) => {
                                                const elapsed = now - start;
                                                const progress = Math.min(elapsed / duration, 1);
                                                const eased = 1 - Math.pow(1 - progress, 4);
                                                const current = Math.round(eased * parseInt(stat.value.replace(/\D/g, '') || 0));
                                                const suffix = stat.value.replace(/[0-9]/g, '');
                                                numEl.textContent = current + suffix;
                                                if (progress < 1) requestAnimationFrame(tick);
                                            };
                                            requestAnimationFrame(tick);
                                            obs.disconnect();
                                        }
                                    }, { threshold: 0.5 });
                                    obs.observe(el);
                                }}>
                                    <span className="proof-num">0</span>
                                    <span className="proof-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* Instagram Showcase — Redirectable Video Link */}
            <section className="agency-instagram" id="instagram-showcase">
                <div className="instagram-inner">
                    <div className="reveal" ref={addToRefs}>
                        <span className="section-tag">Follow Us</span>
                        <h2 className="section-title-agency">Behind The<br /> Scenes.</h2>
                    </div>
                    <div className="instagram-video-grid">
                        <a
                            href="https://www.instagram.com/houseofvisuals.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="instagram-video-card reveal"
                            ref={addToRefs}
                        >
                            <div className="instagram-video-card__play">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
                                </svg>
                            </div>
                            <div className="instagram-video-card__overlay">
                                <div className="instagram-video-card__label">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <circle cx="12" cy="12" r="5"/>
                                        <circle cx="17.5" cy="6.5" r="1.5"/>
                                    </svg>
                                    <span>@houseofvisuals.in</span>
                                </div>
                                <span className="instagram-video-card__cta">Watch Our Reels →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <div className="section-transition" />

            {/* Shop Promo */}
            {/* Shop Internet Culture */}
            <EditableSection sectionKey="shop">
                <section className="agency-shop" id="shop-culture">
                    <div className="shop-culture-inner">
                        <div className="reveal" ref={addToRefs}>
                            <span className="section-tag">{shopHighlight.tag}</span>
                            <h2 className="section-title-agency">{shopHighlight.title1}<br /> {shopHighlight.title2}</h2>
                        </div>

                        {shopProducts.length > 0 ? (
                            <div className="shop-tracks">
                                {[
                                    { label: '🔥 Trending Stickers', items: shopProducts.slice(0, 4) },
                                    { label: '⚡ Limited Drops', items: shopProducts.slice(4, 8) },
                                    { label: '🏆 Best Sellers', items: shopProducts.slice(8, 12) },
                                ].filter(t => t.items.length > 0).map((track, ti) => (
                                    <div className="shop-track shop-track-animate" key={ti} style={{ animationDelay: `${ti * 0.15}s` }}>
                                        <h3 className="shop-track__label">{track.label}</h3>
                                        <div className="shop-track__row">
                                            {track.items.map((p) => (
                                                <div
                                                    className="shop-product-card"
                                                    key={p._id}
                                                    onClick={() => navigate(`/product/${p._id}`)}
                                                >
                                                    <div className="shop-product-card__img">
                                                        <img src={(p.images && p.images.length > 0) ? p.images[0] : p.image} alt={p.name} loading="lazy" />
                                                    </div>
                                                    <div className="shop-product-card__info">
                                                        {p.category && <span className="shop-product-card__cat">{p.category}</span>}
                                                        <h4 className="shop-product-card__name">{p.name}</h4>
                                                        <span className="shop-product-card__price">₹{p.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="shop-tracks-placeholder">
                                <p className="shop-placeholder-text">Explore our collection of premium stickers and merchandise designed for internet culture.</p>
                            </div>
                        )}

                        <div className="shop-cta reveal" ref={addToRefs}>
                            <MagneticButton className="btn-primary-agency btn-lg" onClick={() => navigate('/shop')}>
                                Visit Shop
                            </MagneticButton>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* Authority Section — Why Us */}
            <section className="agency-authority" id="why-us">
                <div className="authority-inner">
                    <div className="reveal" ref={addToRefs}>
                        <span className="section-tag">Why Us</span>
                        <h2 className="section-title-agency">What Sets<br /> Us Apart.</h2>
                    </div>
                    <div className="authority-list">
                        {[
                            { icon: '🎯', title: 'Strategy Before Content', desc: 'Every piece of content stems from a documented strategy — not guesswork.' },
                            { icon: '💎', title: 'Premium Visual Execution', desc: 'Cinematic-grade visuals that make your brand impossible to scroll past.' },
                            { icon: '📈', title: 'Growth Focused Mindset', desc: 'We obsess over metrics. Every campaign is built to move the needle.' },
                            { icon: '🧭', title: 'Clear Brand Positioning', desc: 'We define where you stand in the market — and make sure everyone knows it.' },
                            { icon: '🤝', title: 'Long-Term Partnerships', desc: 'We don\'t do one-offs. We build brands over months and years.' },
                        ].map((point, i) => (
                            <div className="authority-point reveal" key={i} ref={addToRefs}>
                                <div className="authority-point__icon-wrap">
                                    <span className="authority-point__icon">{point.icon}</span>
                                    <div className="authority-point__glow" />
                                </div>
                                <div className="authority-point__text">
                                    <h3 className="authority-point__title">{point.title}</h3>
                                    <p className="authority-point__desc">{point.desc}</p>
                                </div>
                                <span className="authority-point__num">{String(i + 1).padStart(2, '0')}</span>
                                {i < 4 && <div className="authority-separator" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insights Section */}
            <section className="agency-insights">
                <div className="insights-inner">
                    <div className="reveal" ref={addToRefs}>
                        <span className="section-tag">Insights</span>
                        <h2 className="section-title-agency">From the<br /> Studio.</h2>
                    </div>
                    <div className="insights-grid">
                        {[
                            {
                                img: '/insight_ads_fail.png',
                                cat: 'Strategy',
                                read: '5 min read',
                                title: 'Why Most Ads Fail',
                                excerpt: 'The real reason your campaigns aren\'t converting — and what to change right now.',
                                featured: true,
                            },
                            {
                                img: '/insight_viral_content.png',
                                cat: 'Content',
                                read: '7 min read',
                                title: 'Anatomy of Viral Content',
                                excerpt: 'Breaking down what makes content spread — from hooks to emotional triggers.',
                                featured: false,
                            },
                            {
                                img: '/insight_scroll_stopping.png',
                                cat: 'Design',
                                read: '4 min read',
                                title: 'Psychology of Scroll-Stopping Visuals',
                                excerpt: 'How color, contrast, and composition hijack attention in under 0.3 seconds.',
                                featured: false,
                            },
                        ].map((post, i) => (
                            <article
                                className={`insight-card${post.featured ? ' insight-card--featured' : ''} reveal`}
                                key={i}
                                ref={addToRefs}
                            >
                                <div className="insight-card__img">
                                    <img src={post.img} alt={post.title} loading="lazy" />
                                </div>
                                <div className="insight-card__body">
                                    <div className="insight-card__meta">
                                        <span className="insight-card__cat">{post.cat}</span>
                                        <span className="insight-card__read">{post.read}</span>
                                    </div>
                                    <h3 className="insight-card__title">{post.title}</h3>
                                    <p className="insight-card__excerpt">{post.excerpt}</p>
                                    <span className="insight-card__link">Read More →</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dramatic CTA Section */}
            <EditableSection sectionKey="cta">
                <section className="agency-cta-dramatic gradient-interact">
                    {/* Animated Background */}
                    <div className="cta-bg-effects">
                        <div className="cta-beam cta-beam--1" />
                        <div className="cta-beam cta-beam--2" />
                        <div className="cta-beam cta-beam--3" />
                        <div className="cta-wave cta-wave--1" />
                        <div className="cta-wave cta-wave--2" />
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                className="cta-particle"
                                key={i}
                                style={{
                                    left: `${10 + Math.random() * 80}%`,
                                    top: `${10 + Math.random() * 80}%`,
                                    animationDuration: `${3 + Math.random() * 4}s`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    width: `${2 + Math.random() * 4}px`,
                                    height: `${2 + Math.random() * 4}px`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="cta-dramatic-content reveal" ref={addToRefs}>
                        <h2 className="cta-dramatic-title">{cta.titleLine1}<br />{cta.titleLine2}</h2>
                        <div className="cta-dramatic-buttons">
                            <MagneticButton className="btn-primary-agency btn-cta-main" onClick={() => navigate('/contact')}>
                                Start a Project
                            </MagneticButton>
                            <MagneticButton className="btn-outline-agency btn-cta-outline" onClick={() => navigate('/contact')}>
                                Book a Call
                            </MagneticButton>
                            <MagneticButton className="btn-ghost-agency btn-cta-ghost" onClick={() => {
                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                Contact Us
                            </MagneticButton>
                        </div>
                    </div>
                </section>
            </EditableSection>

            {/* Lead Gen Section */}
            <section className="agency-contact reveal" ref={addToRefs}>
                <div className="contact-flex">
                    <div className="contact-info">
                        <span className="section-tag">Contact</span>
                        <h2 className="section-title-agency">Begin Your <br /> Discovery.</h2>
                        <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.2rem' }}>We're looking for partners ready to change how the world sees their brand. Are you one of them?</p>
                        <div style={{ fontSize: '1rem', color: '#999' }}>
                            <p>vision@houseofvisuals.com</p>
                        </div>
                    </div>
                    <div className="contact-form">
                        <form onSubmit={(e) => { e.preventDefault(); alert('Discovery session requested.'); }}>
                            <div className="form-group">
                                <input type="text" placeholder="Identity" required />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Insight Channel (Email)" required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Vision Details" rows="4" required></textarea>
                            </div>
                            <button type="submit" className="btn-submit">Request Discovery</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '80px 8%', opacity: '0.4', fontSize: '0.8rem', letterSpacing: '0.1em', textAlign: 'center' }}>
                © 2026 HOUSE OF VISUALS. THE VISION IS CLEAR.
            </footer>

            {/* Inline Edit Panel for Super Admin */}
            <InlineEditPanel />
        </div>
    );
};

export default LandingPage;
