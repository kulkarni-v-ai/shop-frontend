import { Link } from "react-router-dom";

function Cart({
  cart,
  total,
  totalItems,
  increaseQty,
  decreaseQty,
  removeItem,
}) {
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Cart Items */}
      <div className="cart-items-section">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <span className="cart-count">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
        </div>

        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />

            {/* Details */}
            <div className="cart-item-details">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-stock">In Stock</span>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item._id)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item._id)}
                  >
                    +
                  </button>
                </div>

                <span style={{ color: "#ddd" }}>|</span>

                <button
                  className="btn-remove"
                  onClick={() => removeItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="cart-item-price-col">
              <span className="cart-item-price">
                ₹{(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Sidebar */}
      <div className="cart-summary">
        <h3 className="cart-summary-title">Order Summary</h3>

        <div className="cart-summary-row">
          <span>Subtotal ({totalItems} items)</span>
          <span>₹{total.toLocaleString()}</span>
        </div>

        <div className="cart-summary-row">
          <span>Delivery</span>
          <span style={{ color: "var(--color-text-stock)", fontWeight: 600 }}>
            {total >= 499 ? "FREE" : "₹40"}
          </span>
        </div>

        <div className="cart-summary-row total">
          <span>Total</span>
          <span>₹{(total >= 499 ? total : total + 40).toLocaleString()}</span>
        </div>

        <Link to="/checkout" className="btn-checkout">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;