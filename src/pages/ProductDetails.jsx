import { useParams, Link, useNavigate } from "react-router-dom";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p._id === id);

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  // Generate pseudo-random values for display
  const hash = id ? id.charCodeAt(id.length - 1) % 3 : 0;
  const fullStars = 3 + hash;
  const halfStar = hash < 2 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const stars = "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);

  const ratingCount = 50 + ((id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % 500);
  const discount = 10 + (id.charCodeAt(id.length - 2 >= 0 ? id.length - 2 : 0) % 40);
  const originalPrice = Math.round(product.price / (1 - discount / 100));

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
        <Link to="/">Home</Link>
        <span>›</span>
        {product.category && (
          <>
            <span>{product.category}</span>
            <span>›</span>
          </>
        )}
        <span>{product.name}</span>
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
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-rating">
            <span className="stars">{stars}</span>
            <span className="rating-count">
              {ratingCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="pdp-price-section">
            <div className="pdp-price-label">Deal Price</div>
            <div className="pdp-price">
              <span className="price-symbol">₹</span>
              <span className="price-current">
                {product.price.toLocaleString()}
              </span>
              <span className="price-original">
                M.R.P.: ₹{originalPrice.toLocaleString()}
              </span>
              <span className="price-discount">({discount}% off)</span>
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