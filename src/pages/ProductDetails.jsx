import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (id) {
      fetch(`https://shop-backend-yvk4.onrender.com/api/products/${id}/view`, { method: "POST" })
        .catch(() => { });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div>
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
        {/* Image Section */}
        <div className="pdp-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="pdp-main-image"
          />
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

          <p className="pdp-stock">✓ In Stock</p>

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