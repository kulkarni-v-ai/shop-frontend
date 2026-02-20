import { Link } from "react-router-dom";

function Navbar({ totalItems, user, logout, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) {
  const categories = ["All", "Electronics", "Clothing", "Home", "Books", "Sports", "Beauty"];

  return (
    <nav className="navbar">
      {/* Main Navigation Bar */}
      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">▲</span>
          HOV Shop
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products, brands, and more..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
          <button className="navbar-search-btn" aria-label="Search">
            🔍
          </button>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="navbar-link" onClick={logout} style={{ cursor: "pointer" }}>
              <span className="navbar-link-small">Hello, {user.username}</span>
              <span className="navbar-link-bold">Sign Out</span>
            </div>
          ) : (
            <Link to="/login" className="navbar-link">
              <span className="navbar-link-small">Hello, Sign in</span>
              <span className="navbar-link-bold">Account</span>
            </Link>
          )}

          <Link to="/cart" className="navbar-cart">
            <span className="navbar-cart-icon">
              🛒
              {totalItems > 0 && (
                <span className="navbar-cart-badge">{totalItems}</span>
              )}
            </span>
            <span className="navbar-cart-text">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub Navigation - Category Filters */}
      <div className="navbar-sub">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`subnav-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory && setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;