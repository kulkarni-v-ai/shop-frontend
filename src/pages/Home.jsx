import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

function Home({
  selectedCategory,
  setSelectedCategory,
  products,
  loading,
  error,
  addToCart,
  searchQuery
}) {
  const navigate = useNavigate();
  const [takingLong, setTakingLong] = useState(false);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setTakingLong(true);
      }, 4000);
    } else {
      setTakingLong(false);
      // Animate product cards in smoothly
      if (containerRef.current) {
        gsap.fromTo(
          ".premium-card",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
        );
      }
    }
    return () => clearTimeout(timer);
  }, [loading, products, selectedCategory, searchQuery]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" }
      );
    }
  }, []);

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  if (loading && products.length === 0) {
    return (
      <div className="premium-home-container">
        <div className="premium-hero" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 className="hero-title" style={{ color: '#fff' }}>Connecting to <span style={{ color: '#d4af37' }}>Core</span>...</h1>
          <div style={{ marginTop: '20px', width: '40px', height: '40px', border: '3px solid rgba(212, 175, 55, 0.3)', borderTop: '3px solid #d4af37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-home-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <h2 style={{ color: '#ff4444' }}>System Disturbance: {error}</h2>
      </div>
    );
  }

  return (
    <div className="premium-home-container" ref={containerRef}>
      <style>{`
        /* Embedded Premium Styling to override Amazon-like styles */
        body {
          background-color: #05020a;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }
        .premium-home-container {
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #1a0b2e 0%, #05020a 60%);
          padding: 0 5%;
          padding-bottom: 100px;
        }
        .premium-hero {
          padding: 15vh 0 10vh 0;
          text-align: center;
          position: relative;
        }
        .premium-hero-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          font-size: 0.8rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 24px;
          background: rgba(212, 175, 55, 0.05);
          backdrop-filter: blur(10px);
        }
        .premium-hero h1 {
          font-size: clamp(3rem, 6vw, 6rem);
          font-weight: 300;
          letter-spacing: -2px;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .premium-hero h1 span {
          color: #d4af37;
          font-style: italic;
          font-weight: 400;
        }
        .premium-hero p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .premium-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: pointer;
        }
        .premium-card:hover {
          transform: translateY(-10px);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(147, 51, 234, 0.1);
        }
        .premium-card-image-wrap {
          width: 100%;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          position: relative;
          overflow: hidden;
          background: rgba(0,0,0,0.3);
        }
        .premium-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-card:hover .premium-card-image {
          transform: scale(1.05);
        }
        .premium-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .premium-category {
          font-size: 0.75rem;
          color: #9333ea;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }
        .premium-title {
          font-size: 1.4rem;
          font-weight: 400;
          margin: 0 0 16px;
          color: #ffffff;
        }
        .premium-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .premium-price {
          font-size: 1.2rem;
          color: #d4af37;
          font-weight: 300;
        }
        .premium-btn {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.85rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .premium-btn:hover {
          background: #d4af37;
          border-color: #d4af37;
          color: #000;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Cinematic Hero */}
      <div className="premium-hero" ref={heroRef}>
        <div className="premium-hero-badge">✦ The Vault</div>
        <h1>
          Curated <span>Artifacts</span>
        </h1>
        <p>
          Step into our exclusive collection. Precision-crafted merchandise, stickers, and physical extensions of the House of Visuals universe.
        </p>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '10vh', color: 'rgba(255,255,255,0.5)' }}>
          <p>No artifacts align with your query.</p>
        </div>
      ) : (
        <div className="premium-grid">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="premium-card"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <div className="premium-card-image-wrap">
                <img
                  src={(p.images && p.images.length > 0) ? p.images[0] : p.image}
                  alt={p.name}
                  className="premium-card-image"
                  loading="lazy"
                />
              </div>
              <div className="premium-card-body">
                {p.category && (
                  <span className="premium-category">{p.category}</span>
                )}
                <h3 className="premium-title">{p.name}</h3>
                
                <div className="premium-footer">
                  <div className="premium-price">
                    ₹{p.price.toLocaleString()}
                  </div>
                  <button
                    className="premium-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                  >
                    Collect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;