import { Link } from "react-router-dom";

function Checkout({ cart, total, checkout }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      <h3>Total: ₹{total}</h3>

      <button onClick={checkout}>Place Order</button>

      <br /><br />

      <Link to="/">← Continue Shopping</Link>
    </div>
  );
}

export default Checkout;