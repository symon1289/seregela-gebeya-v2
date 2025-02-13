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
import PrivateRoute from "./routes/PrivateRoute";
import ProfileUi from "./pages/ProfileUi";
import TestLogin from "./pages/TestLogin";
// import { RootState } from "./store/store";
import { Navigate } from "react-router-dom";
import CBEmobile from "./components/payments/CBEmobile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfServices from "./pages/TermsOfServices";
import FAQ from "./pages/FAQ";
import DeliveryReturnPolicy from "./pages/DeliveryReturnPolicy";
import ContactUs from "./pages/ContactUs";
import Apollo from "./components/payments/Apollo";
// import { useSelector } from "react-redux";
function App() {
    // const { user } = useSelector((state: RootState) => state.auth);
    // @ts-expect-error user is not null
    const userData = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <Router>
                <ScrollToTop />
                <HelmetProvider>
                    <TopBar />
                    <MainHeader />

                    <Routes>
                        <Route path="/seregela-gebeya-v2" element={<Home />} />
                        <Route
                            path="/seregela-gebeya-v2/products"
                            element={<Products />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/cart"
                            element={<Cart />}
                        />
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
                        <Route
                            path="/seregela-gebeya-v2/wishlist"
                            element={<Wishlist />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/privacy-policy"
                            element={<PrivacyPolicy />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/terms-of-service"
                            element={<TermsOfServices />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/faq"
                            element={<FAQ />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/return-policy"
                            element={<DeliveryReturnPolicy />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/contact"
                            element={<ContactUs />}
                        />
                        <Route
                            path="/seregela-gebeya-v2/login"
                            element={
                                userData ? (
                                    <Navigate
                                        to="/seregela-gebeya-v2"
                                        replace
                                    />
                                ) : (
                                    <Login />
                                )
                            }
                        />
                        <Route path="" element={<PrivateRoute />}>
                            <Route
                                path="/seregela-gebeya-v2/profile"
                                element={<ProfileUi />}
                            />

                            <Route
                                path="/seregela-gebeya-v2/checkout/shipping"
                                element={<Delivery />}
                            />
                            <Route
                                path="/seregela-gebeya-v2/checkout/payment"
                                element={<Payment />}
                            />
                            <Route
                                path="/seregela-gebeya-v2/checkout/payment/cbebanking"
                                element={<CBEmobile />}
                            />
                            <Route
                                path="/seregela-gebeya-v2/checkout/payment/apollo"
                                element={<Apollo />}
                            />
                        </Route>
                        <Route
                            path="/seregela-gebeya-v2/test"
                            element={<TestLogin />}
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
