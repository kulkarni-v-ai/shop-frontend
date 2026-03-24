import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./context/AuthContext";
import { CMSProvider } from "./context/CMSContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { InlineEditProvider } from "./context/InlineEditContext";
import { getProducts } from "./api";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminLayout = lazy(() => import("./pages/AdminLayout"));

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
    const fetchProducts = async (retries = 3) => {
      try {
        const { data } = await getProducts();
        setProducts(data);
        localStorage.setItem("cached_products", JSON.stringify(data));
        setLoading(false);
      } catch (err) {
        if (retries > 0) {
          // Wait 2 seconds before retrying to allow the backend to wake up
          setTimeout(() => fetchProducts(retries - 1), 2000);
        } else {
          if (products.length === 0) {
            setError("Failed to load products. Backend might be asleep, please try again.");
          }
          setLoading(false);
        }
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

  const checkout = async (userData) => {
    const token = localStorage.getItem("token");
    try {
      const shippingAddress = userData?.address ? {
        name: userData.name,
        street: userData.address.street,
        city: userData.address.city,
        state: userData.address.state,
        zip: userData.address.zip
      } : null;

      await fetch("https://shop-backend-yvk4.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          total: total,
          userId: userData?._id,
          shippingAddress
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
        <CMSProvider>
          <AdminAuthProvider>
            <InlineEditProvider>
              <Router>
                <AppShell
                  totalItems={totalItems}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  cart={cart}
                  total={total}
                  products={products}
                  loading={loading}
                  error={error}
                  addToCart={addToCart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeItem={removeItem}
                  checkout={checkout}
                  showToast={showToast}
                  toast={toast}
                />
              </Router>
            </InlineEditProvider>
          </AdminAuthProvider>
        </CMSProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function AppShell({
  totalItems, selectedCategory, setSelectedCategory,
  searchQuery, setSearchQuery, cart, total, products,
  loading, error, addToCart, increaseQty, decreaseQty,
  removeItem, checkout, showToast, toast
}) {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isLanding && !isAdmin && (
        <Navbar
          totalItems={totalItems}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <main className={isLanding || isAdmin ? '' : 'main-content'}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="loading-spinner" />
          </div>
        }>
          <Routes>
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={<AdminLayout />} />

            <Route
              path="/"
              element={<LandingPage />}
            />

            <Route
              path="/shop"
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
        </Suspense>
      </main>

      {!isLanding && !isAdmin && <Footer />}

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default App;
