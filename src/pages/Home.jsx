import { Link } from "react-router-dom";

function Home({
  selectedCategory,
  setSelectedCategory,
  products,
  loading,
  error,
  addToCart
}) {
  return (
    <div style={{ padding: 20 }}>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Clothing">Clothing</option>
        <option value="Accessories">Accessories</option>
        <option value="Electronics">Electronics</option>
      </select>

      <h1>🛍 Products</h1>

      <Link to="/cart">Go to Cart</Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {products
        .filter(p =>
          selectedCategory === "All"
            ? true
            : p.category === selectedCategory
        )
        .map((p) => (
          <div key={p._id}>
            <img src={p.image} width="150" />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            <Link to={`/product/${p._id}`}>
              View Details
            </Link>

            <button onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
    </div>
  );
}

export default Home;