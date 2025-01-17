import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import TopBar from "./components/Header/TopBar";
import MainHeader from "./components/Header/MainHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PWABadge from "./PWABadge";
import ScrollToTop from "./components/ScrollToTop";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Subcategory from "./pages/Subcategory";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import Delivery from "./pages/Delivery";
import Payment from "./pages/Payment";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <HelmetProvider>
          <TopBar />
          <MainHeader />
          <Routes>
            <Route path="/seregela-gebeya-v2" element={<Home />} />
            <Route path="/seregela-gebeya-v2/products" element={<Products />} />
            <Route path="/seregela-gebeya-v2/cart" element={<Cart />} />
            <Route
              path="/seregela-gebeya-v2/products/:id"
              element={<ProductDetail />}
            />
            <Route
              path="/seregela-gebeya-v2/category/:id"
              element={<Category />}
            />
            <Route
              path="/seregela-gebeya-v2/subcategory/:id"
              element={<Subcategory />}
            />
            <Route path="/seregela-gebeya-v2/login" element={<Login />} />
            <Route
              path="/seregela-gebeya-v2/profile"
              element={<UserProfile />}
            />
            <Route path="/seregela-gebeya-v2/wishlist" element={<Wishlist />} />
            <Route
              path="/seregela-gebeya-v2/checkout/shipping"
              element={<Delivery />}
            />
            <Route
              path="/seregela-gebeya-v2/checkout/payment"
              element={<Payment />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <PWABadge />
        </HelmetProvider>
      </Router>
    </>
  );
}

export default App;
