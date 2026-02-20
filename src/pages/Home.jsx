import { useNavigate } from "react-router-dom";

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

  // Generate pseudo-random stars for visual display
  const getStars = (id) => {
    const hash = id ? id.charCodeAt(id.length - 1) % 3 : 0;
    const full = 3 + hash;
    const half = hash < 2 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  };

  const getRatingCount = (id) => {
    if (!id) return 42;
    const h = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return 50 + (h % 500);
  };

  const getDiscount = (id) => {
    if (!id) return 15;
    return 10 + (id.charCodeAt(id.length - 2 >= 0 ? id.length - 2 : 0) % 40);
  };

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  if (loading) {
    return (
      <div>
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-badge">Welcome to HOV Shop</div>
            <h1 className="hero-title">
              Discover <span>Amazing Deals</span> Every Day
            </h1>
            <p className="hero-subtitle">Loading the best products for you...</p>
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="skeleton-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-body">
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <p className="error-hint">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">🔥 Trending Now</div>
          <h1 className="hero-title">
            Shop the Best <span>Deals</span> Today
          </h1>
          <p className="hero-subtitle">
            Explore thousands of products at unbeatable prices. Free delivery on
            orders above ₹499.
          </p>
          <a href="#products" className="hero-cta">
            Shop Now →
          </a>
        </div>
      </div>

      {/* Products Section */}
      <div id="products">
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h2>
          <span className="section-count">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="error-container">
            <div className="error-icon">🔍</div>
            <p className="error-message">No products found</p>
            <p className="error-hint">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => {
              const discount = getDiscount(p._id);
              const originalPrice = Math.round(p.price / (1 - discount / 100));
              return (
                <div
                  key={p._id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  {/* Image */}
                  <div className="product-card-image-wrapper">
                    {discount >= 30 && (
                      <span className="product-card-badge">
                        {discount}% OFF
                      </span>
                    )}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-card-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="product-card-body">
                    {p.category && (
                      <span className="product-card-category">{p.category}</span>
                    )}

                    <h3 className="product-card-title">{p.name}</h3>

                    <div className="product-card-rating">
                      <span className="stars">{getStars(p._id)}</span>
                      <span className="rating-count">
                        {getRatingCount(p._id).toLocaleString()}
                      </span>
                    </div>

                    <div className="product-card-price">
                      <span className="price-symbol">₹</span>
                      <span className="price-current">
                        {p.price.toLocaleString()}
                      </span>
                      <span className="price-original">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                      <span className="price-discount">({discount}% off)</span>
                    </div>

                    <span className="product-card-stock">In stock</span>

                    <div className="product-card-actions">
                      <button
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;