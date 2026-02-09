import { useEffect, useState } from "react";
import AdminOrders from "./AdminOrders";


function App() {
  const [products, setProducts] = useState([]);
 const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);
  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);


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

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);


  const checkout = async () => {
  await fetch("https://shop-backend-yvk4.onrender.com/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: cart,
      total: total,
    }),
  });

  alert("Order placed!");

  setCart([]);
};

  return (
  <>
    <AdminOrders />


    
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🛍 Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {products.map((p) => (
  <div
    key={p._id}
    style={{
      marginBottom: 12,
      padding: 10,
      border: "1px solid #ddd",
      borderRadius: 6
    }}
  >
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

      <h2>🛒 Cart ({totalItems} items)</h2>
      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            marginBottom: 8,
            padding: 8,
            borderBottom: "1px solid #eee"
          }}
        >
          <strong>{item.name}</strong> × {item.qty} = ₹{item.price * item.qty}

          <button
            style={{ marginLeft: 10 }}
            onClick={() => increaseQty(item._id)}
          >
            +
          </button>
          

          <button
            style={{ marginLeft: 5 }}
            onClick={() => decreaseQty(item._id)}
          >
            −
          </button>

          <button
            style={{ marginLeft: 10, color: "red" }}
            onClick={() => removeItem(item._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
      
      <button
  onClick={checkout}
  style={{
    marginTop: 15,
    padding: "10px 18px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  }}
>
  Checkout
</button>

    </div>

  </>
);

}

export default App;
