import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🛍 Products</h1>

      {products.map((p) => (
        <div key={p._id} style={{ marginBottom: 10 }}>
          <strong>{p.name}</strong> — ₹{p.price}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => addToCart(p)}
          >
            Add to cart
          </button>
        </div>
      ))}

      <hr />

      <h2>🛒 Cart</h2>
      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item._id}>
          {item.name} × {item.qty} = ₹{item.price * item.qty}
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
    </div>
  );
}

export default App;
