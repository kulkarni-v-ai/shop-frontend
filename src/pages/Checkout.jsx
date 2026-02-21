import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Checkout({ cart, total, checkout }) {
  const { user, loading } = useAuth();
  const deliveryFee = total >= 499 ? 0 : 40;
  const orderTotal = total + deliveryFee;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">📦</div>
        <h3>Nothing to checkout</h3>
        <p>Your cart is empty. Add some products first.</p>
        <Link to="/" className="btn-continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Items Section */}
      <div className="checkout-section">
        <h2 className="checkout-title">Review Your Order</h2>

        {cart.map((item) => (
          <div key={item._id} className="checkout-item">
            <img
              src={item.image}
              alt={item.name}
              className="checkout-item-image"
            />
            <div className="checkout-item-info">
              <span className="checkout-item-name">{item.name}</span>
              <span className="checkout-item-qty">Qty: {item.qty}</span>
            </div>
            <span className="checkout-item-price">
              ₹{(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h3 className="order-summary-title">Order Summary</h3>

        <div className="order-summary-row">
          <span>Items ({totalItems}):</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <div className="order-summary-row">
          <span>Delivery:</span>
          <span style={{ color: deliveryFee === 0 ? "var(--color-text-stock)" : "inherit", fontWeight: deliveryFee === 0 ? 600 : 400 }}>
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>

        <hr className="order-summary-divider" />

        <div className="order-summary-row total">
          <span>Order Total:</span>
          <span>₹{orderTotal.toLocaleString()}</span>
        </div>

        <button className="btn-place-order" onClick={checkout}>
          Place Your Order
        </button>

        <div className="checkout-secure">
          🔒 Secure checkout — your data is protected
        </div>

        <Link
          to="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "var(--space-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Checkout;