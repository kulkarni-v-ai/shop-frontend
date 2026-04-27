import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (id) {
      fetch(`https://shop-backend-yvk4.onrender.com/api/products/${id}/view`, { method: "POST" })
        .catch(() => { });
    }
  }, [id]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  // Build unified images array with backward compat
  const allImages = (product.images && product.images.length > 0)
    ? product.images
    : product.image ? [product.image] : [];

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div>
      <style>{`
        .pdp-gallery {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pdp-main-image-wrap {
          position: relative;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(0,0,0,0.3);
          aspect-ratio: 1 / 1;
        }
        .pdp-main-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        .pdp-thumbnails {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0;
        }
        .pdp-thumb {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 2px solid transparent;
          transition: all 0.25s ease;
          opacity: 0.5;
        }
        .pdp-thumb:hover {
          opacity: 0.8;
        }
        .pdp-thumb.active {
          border-color: var(--color-accent, #d4af37);
          opacity: 1;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
        }
        .pdp-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pdp-image-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.65);
          color: #fff;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          letter-spacing: 0.05em;
        }
        .pdp-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
          z-index: 2;
        }
        .pdp-nav-btn:hover {
          background: rgba(212, 175, 55, 0.7);
        }
        .pdp-nav-prev { left: 12px; }
        .pdp-nav-next { right: 12px; }
      `}</style>

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <Link to="/shop">Shop</Link>
        <span style={{ color: 'var(--color-accent)' }}>›</span>
        {product.category && (
          <>
            <span>{product.category}</span>
            <span style={{ color: 'var(--color-accent)' }}>›</span>
          </>
        )}
        <span style={{ color: 'var(--color-text-secondary)' }}>{product.name}</span>
      </div>

      {/* Product Detail Container */}
      <div className="pdp-container">
        {/* Image Gallery Section */}
        <div className="pdp-image-section">
          <div className="pdp-gallery">
            {/* Main Image */}
            <div className="pdp-main-image-wrap">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                  className="pdp-main-image"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)' }}>
                  No image available
                </div>
              )}

              {/* Navigation arrows (only if multiple images) */}
              {allImages.length > 1 && (
                <>
                  <button
                    className="pdp-nav-btn pdp-nav-prev"
                    onClick={() => setSelectedImageIndex((prev) => prev === 0 ? allImages.length - 1 : prev - 1)}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="pdp-nav-btn pdp-nav-next"
                    onClick={() => setSelectedImageIndex((prev) => prev === allImages.length - 1 ? 0 : prev + 1)}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  <span className="pdp-image-counter">
                    {selectedImageIndex + 1} / {allImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnails strip */}
            {allImages.length > 1 && (
              <div className="pdp-thumbnails">
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    className={`pdp-thumb ${i === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="pdp-info">
          {product.category && (
            <span style={{ 
              color: 'var(--color-accent)', 
              fontSize: '0.75rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em', 
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              {product.category}
            </span>
          )}
          
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-price-section">
            <div className="pdp-price">
              <span className="price-symbol">₹</span>
              <span className="price-current">
                {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="pdp-stock">
            {product.stock > 0 ? '✓ In Stock' : '✕ Out of Stock'}
          </p>

          {product.description && (
            <div className="pdp-description">
              <h4>About this item</h4>
              <p>{product.description}</p>
            </div>
          )}

          <div className="pdp-actions">
            <button className="btn-add-cart-large" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;