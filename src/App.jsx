import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { getProducts } from "./api";
import "./App.css";

// TODO: Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "382931076466-m0ue6cavrk7g5su9b1k4o1dvtukqvjp0.apps.googleusercontent.com";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("cached_products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
        localStorage.setItem("cached_products", JSON.stringify(data));
        setLoading(false);
      } catch (err) {
        if (products.length === 0) {
          setError("Failed to load products");
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✓ ${product.name} added to cart`);
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
    const token = localStorage.getItem("token");
    try {
      await fetch("https://shop-backend-yvk4.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: total,
        }),
      });

      showToast("🎉 Order placed successfully!");
      setCart([]);
    } catch (error) {
      showToast("❌ Failed to place order");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Navbar
            totalItems={totalItems}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    products={products}
                    loading={loading}
                    error={error}
                    addToCart={addToCart}
                    searchQuery={searchQuery}
                  />
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile showToast={showToast} />} />

              <Route
                path="/cart"
                element={
                  <Cart
                    cart={cart}
                    total={total}
                    totalItems={totalItems}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeItem={removeItem}
                  />
                }
              />

              <Route
                path="/checkout"
                element={
                  <Checkout
                    cart={cart}
                    total={total}
                    checkout={checkout}
                  />
                }
              />

              <Route
                path="/product/:id"
                element={
                  <ProductDetails
                    products={products}
                    addToCart={addToCart}
                  />
                }
              />
            </Routes>
          </main>

          <Footer />

          {/* Toast Notification */}
          {toast && <div className="toast">{toast}</div>}
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;