import { Link } from "react-router-dom";

function Cart({
  cart,
  total,
  totalItems,
  increaseQty,
  decreaseQty,
  removeItem
}) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Cart ({totalItems} items)</h2>

      <Link to="/">← Back to Products</Link>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item._id}>
          <strong>{item.name}</strong> × {item.qty} = ₹{item.price * item.qty}

          <button onClick={() => increaseQty(item._id)}>+</button>
          <button onClick={() => decreaseQty(item._id)}>−</button>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <Link to="/checkout">
        <button>Proceed to Checkout</button>
      </Link>
    </div>
  );
}

export default Cart;