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
import Payment from "./pages/Payment";
import PrivateRoute from "./routes/PrivateRoute";
import ProfileUi from "./pages/ProfileUi";
import { RootState } from "./store/store";
import { Navigate } from "react-router-dom";
import CBEmobile from "./components/payments/CBEmobile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfServices from "./pages/TermsOfServices";
import FAQ from "./pages/FAQ";
import DeliveryReturnPolicy from "./pages/DeliveryReturnPolicy";
import ContactUs from "./pages/ContactUs";
import Apollo from "./components/payments/Apollo";
import Abay from "./components/payments/Abay";
import Bunna from "./components/payments/Bunna";
import CBEbirr from "./components/payments/CBEbirr";
import Awash from "./components/payments/Awash";
import { useSelector } from "react-redux";
import MiniCart from "./components/MiniCart";
import Packages from "./pages/Packages";
import Tags from "./pages/Tags";
import PackageDetail from "./pages/PackageDetail";
import Register from "./pages/Register";
function App() {
    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <>
            <Router basename="/seregela-gebeya-v2">
                <ScrollToTop />
                <HelmetProvider>
                    <TopBar />
                    <MainHeader />
                    <MiniCart />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/packages" element={<Packages />} />
                        <Route path="/tags/:id/packages" element={<Tags />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/products/:id"
                            element={<ProductDetail />}
                        />
                        <Route
                            path="/packages/:id"
                            element={<PackageDetail />}
                        />
                        <Route path="/category/:id" element={<Category />} />
                        <Route
                            path="/subcategory/:id"
                            element={<Subcategory />}
                        />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route
                            path="/privacy-policy"
                            element={<PrivacyPolicy />}
                        />
                        <Route
                            path="/terms-of-service"
                            element={<TermsOfServices />}
                        />
                        <Route path="/faq" element={<FAQ />} />
                        <Route
                            path="/return-policy"
                            element={<DeliveryReturnPolicy />}
                        />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route
                            path="/login"
                            element={
                                user ? <Navigate to="/" replace /> : <Login />
                            }
                        />
                        {/* <Route
                            path="/register"
                            element={
                                user?.first_name !== null &&
                                user?.last_name !== null ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <Login />
                                )
                            }
                        /> */}
                        <Route path="/register" element={<Register />} />
                        <Route path="" element={<PrivateRoute />}>
                            <Route path="/profile" element={<ProfileUi />} />
                            <Route
                                path="/checkout/payment"
                                element={<Payment />}
                            />
                            <Route
                                path="/checkout/payment/cbebanking"
                                element={<CBEmobile />}
                            />
                            <Route
                                path="/checkout/payment/apollo"
                                element={<Apollo />}
                            />
                            <Route
                                path="/checkout/payment/abay"
                                element={<Abay />}
                            />
                            <Route
                                path="/checkout/payment/bunna"
                                element={<Bunna />}
                            />
                            <Route
                                path="/checkout/payment/cbebirr"
                                element={<CBEbirr />}
                            />
                            <Route
                                path="/checkout/payment/awash-birr"
                                element={<Awash />}
                            />
                        </Route>
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
