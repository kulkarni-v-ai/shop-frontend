import { Link } from "react-router-dom";

function Navbar({ totalItems, user, logout }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      background: "#111",
      color: "white"
    }}>
      <Link to="/" style={{ color: "white", fontSize: 20 }}>
        🛍 Shop
      </Link>

      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/cart" style={{ color: "white" }}>
          🛒 Cart ({totalItems})
        </Link>

        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;