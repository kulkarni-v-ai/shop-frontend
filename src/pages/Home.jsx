import { useNavigate } from "react-router-dom";

function Home({
  selectedCategory,
  setSelectedCategory,
  products,
  loading,
  error,
  addToCart
}) {

  const navigate = useNavigate(); // ✅ MUST BE INSIDE COMPONENT

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 30,
        marginTop: 30,
      }}
    >
      {products
        .filter(p =>
          selectedCategory === "All"
            ? true
            : p.category === selectedCategory
        )
        .map((p) => (
          <div
            key={p._id}
            style={{
              background: "#111",
              padding: 15,
              borderRadius: 12,
              transition: "0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/product/${p._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />

            <h3 style={{ marginTop: 15 }}>{p.name}</h3>
            <p style={{ opacity: 0.8 }}>₹{p.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevents navigation
                addToCart(p);
              }}
              style={{
                marginTop: 10,
                padding: "8px 14px",
                background: "#2ecc71",
                border: "none",
                borderRadius: 6,
                color: "white",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
    </div>
  );
}

export default Home;