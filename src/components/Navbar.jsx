import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ totalItems, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const categories = ["All", "Posters", "Stickers", "Artifacts"];

  return (
    <nav className="navbar">
      {/* Main Navigation Bar */}
      <div className="navbar-main">
        {/* Logo */}
        <Link to="/" className="navbar-logo" style={{ border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="HOV" style={{ height: '32px', width: 'auto', borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>HOV</span>
        </Link>

        {/* Shop Label */}
        <Link to="/shop" style={{ 
          color: '#d4af37', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          textDecoration: 'none',
          padding: '6px 16px',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '4px'
        }}>
          Shop
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
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
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link to="/profile" className="navbar-link">
                <span className="navbar-link-small">Hello, {user.name}</span>
                <span className="navbar-link-bold">My Account</span>
              </Link>
              <div className="navbar-link" onClick={logout} style={{ cursor: "pointer" }}>
                <span className="navbar-link-small">&nbsp;</span>
                <span className="navbar-link-bold">Sign Out</span>
              </div>
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
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory(cat);
              if (window.location.pathname !== '/shop') {
                navigate('/shop');
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;