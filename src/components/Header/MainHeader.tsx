import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, X, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CategoryNav from "../CategoryNav";
import freeDelivery from "../../assets/image_2024-11-08_17-21-35.png";
import { useCategory } from "../../hooks/useCategory";
import { useProducts } from "../../hooks/useProducts";
import { Product as HookProduct } from "../../types/product";
import { Product } from "../../types/product";
import logomini from "../../assets/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { calculateCartTotals } from "../../utils/CartUtils";
import { FaUserAlt } from "react-icons/fa";
import PriceFormatter from "../PriceFormatter";
import CategoryNavLoading from "../loading skeletons/category/CategoryNav.tsx";

const Navbar = () => {
    const userData = useSelector((state: RootState) => state.auth.user);

    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const { products: hookSearchResults, isLoading } = useProducts({
        id: undefined,
        endpoint: "products",
        searchName: debouncedSearchQuery,
    });

    const searchResults: Product[] = hookSearchResults.map(
        (product: HookProduct) => ({
            id: Number(product.id),
            name: product.name,
            name_am: null,
            description: null,
            description_am: null,
            supplier: {
                id: 0,
                name: "",
                name_am: null,
                phone_number: "",
            },
            brand: "",
            measurement_type: product.unit,
            price: product.price.toString(),
            discount: product.discount.toString(),
            category_id: null,
            category: null,
            subcategory: null,
            subcategory_id: null,
            total_quantity: 0,
            left_in_stock: product.left_in_stock || 0,
            image_paths: product.image ? [product.image] : [], // Add null check here
            stores: [],
            image: product.image,
            created_at: product.created_at,
            updated_at: product.created_at,
            rating: null,
            is_non_stocked: 0,
            is_active: 1,
            unit: product.unit,
            originalPrice: product.originalPrice.toString(),
            max_quantity_per_order: product.max_quantity_per_order,
        })
    );
    const { first_name, last_name } = userData ?? {};
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const itemCount =
        cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;
    const packagesitems = useSelector(
        (state: RootState) => state.cart.packages
    );
    const selectedDeliveryType = useSelector(
        (state: RootState) => state.cart.delivery_type
    );
    const packagecount =
        packagesitems?.reduce((total, item) => total + item.quantity, 0) ?? 0;
    const { categories, isLoading: loading_categories } = useCategory();
    const { t } = useTranslation();
    const { subtotal, grandTotal } = calculateCartTotals(
        cartItems,
        packagesitems,
        selectedDeliveryType
    );
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setIsSearchOpen(true);
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSearchOpen(false);
        navigate(`/products?name=${encodeURIComponent(searchQuery)}`);
    };

    const handleResultClick = (product: Product) => {
        setIsSearchOpen(false);
        setSearchQuery("");
        navigate(`/products/${product.id}`);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <nav
            className={`bg-[#e7a334]  shadow-black/15 text-white pb-0.5 pt-2 xs:pb-[7px] sticky top-0 z-[100] transition-all duration-300 items-center ${
                isScrolled ? "shadow-xl  pt-1 pb-0.5" : ""
            }`}
        >
            <div className="max-w-screen-xl mx-auto pr-4 pl-1 ">
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-4 h-16">
                    {/* Logo and Menu Button */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="block sm:block md:hidden lg:hidden xl:hidden text-white"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                        <Link
                            to="/"
                            className={`hidden sm:flex items-center justify-end h-[65px] w-[80px] md:w-[180px] lg:w-[220px]`}
                            aria-label="SeregelaGebeya"
                        >
                            <img
                                src={logomini}
                                alt="Logo"
                                className={`w-[80px] h-[60px] aspect-[720/555] object-contain  ${
                                    isScrolled ? "lg:h-[50px] lg:w-[70px]" : ""
                                }`}
                            />
                            <div className="hidden md:flex md:flex-col lg:flex lg:flex-col lg:h-[23px] md:h-[23px] text-black ">
                                <p className="logo-english">SeregelaGebeya</p>
                                <p className="logo-amharic">ሠረገላ ገበያ</p>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div
                        ref={searchRef}
                        className={`flex-1 max-w-[665px]  relative gap-3 ${
                            userData ? "md:pr-10 pl-2" : "pr-4 pl-9"
                        } `}
                    >
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative mx-auto flex w-full max-w-2xl items-center justify-between rounded-md">
                                <svg
                                    className="absolute left-2 block h-5 w-5 text-gray-400 z-50"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx={11} cy={11} r={8} />
                                    <line
                                        x1={21}
                                        y1={21}
                                        x2="16.65"
                                        y2="16.65"
                                    />
                                </svg>
                                <div className="absolute inset-y-0 left-0 flex items-center w-full">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        name="search"
                                        className="h-10 w-full rounded-md py-4 pr-0 pl-12 outline-none focus:ring-2  text-gray-900 focus:border-primary focus:ring-primary"
                                        placeholder={t("search")}
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Search"
                                        onClick={handleSearchSubmit}
                                        className="absolute right-0 mr-1 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2 sm:px-4 font-medium text-xs sm:text-base text-white hover:bg-white  hover:text-primary border border-primary transition-colors duration-300"
                                    >
                                        {t("search_button")}
                                    </button>
                                </div>

                                {/* <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder={t("search")}
                                    className="w-full px-10 py-2 rounded-full text-gray-900 focus:outline-none border border-transparent focus:border-[#e7a334]"
                                /> */}

                                {/* Loading Indicator */}
                                {isLoading && (
                                    <div className="absolute right-3 top-0">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#e9a83a]"></div>
                                    </div>
                                )}

                                {/* Search Results */}
                                {isSearchOpen &&
                                    searchResults.length > 0 &&
                                    !isLoading && (
                                        <div className="absolute top-full left-0 right-0 mt-6 bg-white rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto">
                                            <ul className="py-2 divide-y divide-gray-100">
                                                {searchResults.map(
                                                    (product) => (
                                                        <li
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                            key={product.id}
                                                            onClick={() =>
                                                                handleResultClick(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                className="w-10 h-10 object-cover rounded"
                                                                alt={
                                                                    product.name
                                                                }
                                                            />
                                                            <div>
                                                                <div className="text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    <PriceFormatter
                                                                        price={product.price.toString()}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="px-4 py-2 border-t border-gray-100">
                                                <Link
                                                    to={`/products?name=${encodeURIComponent(
                                                        searchQuery
                                                    )}`}
                                                    className="text-[#e7a334] hover:underline"
                                                    onClick={() =>
                                                        setIsSearchOpen(false)
                                                    }
                                                >
                                                    {t("View All Results")}
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                {/* No Results Message */}
                                {isSearchOpen &&
                                    searchQuery &&
                                    searchResults.length === 0 &&
                                    !isLoading && (
                                        <div className="absolute top-full left-0 right-0 mt-6 bg-white rounded-lg shadow-2xl z-[100] max-h-96 overflow-y-auto">
                                            <div className="px-4 py-3 text-gray-600 text-center">
                                                {t(
                                                    "No products found for this search"
                                                )}{" "}
                                                "{searchQuery}"
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </form>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 pl-0 md:pl-5">
                        {userData ? (
                            <Link
                                to="/profile"
                                className="hidden xl:flex hover:text-gray-200 bg-[#e7a334] rounded-lg px-2 py-2 text-white items-center gap-2"
                                aria-label="Profile"
                            >
                                <FaUserAlt size={24} />
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden xl:flex hover:text-white hover:bg-primary bg-white rounded-lg px-2 py-1.5 text-quaternary items-center gap-2 transition-colors duration-300 border border-white"
                                aria-label="Login"
                            >
                                <User size={24} />
                                <span>{t("login")}</span>
                            </Link>
                        )}
                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative hover:text-gray-200 text-white rounded-lg px-1 py-2 "
                            aria-label="Cart"
                        >
                            <FaCartShopping size={24} />
                            {itemCount + packagecount > 0 && (
                                <span className="absolute -top-1 -right-0  bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {itemCount + packagecount}
                                </span>
                            )}
                        </Link>

                        {subtotal > 0 ? (
                            <div className="ml-1 hidden sm:flex flex-col font-bold">
                                <span className="text-xs text-gray-100">
                                    {t("your_cart")}
                                </span>
                                <PriceFormatter price={grandTotal.toString()} />
                            </div>
                        ) : (
                            <div className="ml-1 hidden sm:flex flex-col font-bold">
                                <span className="text-xs text-gray-100">
                                    {t("your_cart")}
                                </span>
                                <span>0.00 {t("birr")} </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[51]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}
                {/* Mobile Menu */}
                <div
                    className={`${
                        isMobileMenuOpen
                            ? "translate-x-0"
                            : "-translate-x-full "
                    } fixed inset-0 z-[51] xl:hidden transform transition-transform duration-300 ease-in-out w-[280px] xl:w-[300px]`}
                >
                    {/* Menu Content */}
                    <div
                        className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}

                        <div className="h-full flex flex-col">
                            {/* Menu Content */}
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <Link
                                        to="/"
                                        className="flex items-center h-[61px] w-[80px] lg:w-[220px]"
                                    >
                                        <img
                                            src={logomini}
                                            alt="Logo"
                                            className="object-cover"
                                        />
                                    </Link>
                                    <button
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="absolute top-4 right-4 p-2 bg-[#e9a83a] hover:bg-[#fed874] rounded-full text-white z-50"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                {/* Account Link */}
                                {userData ? (
                                    <Link
                                        to="/profile"
                                        className="hidden xl:flex hover:text-gray-200 bg-white rounded-lg px-4 py-2 text-[#e7a334] items-center gap-2"
                                    >
                                        <User size={24} />
                                        <span>{first_name}</span>
                                        <span>{last_name}</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center  gap-3 py-3 text-gray-900 hover:bg-gray-50"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <User size={28} />
                                        <span>{t("login")}</span>
                                    </Link>
                                )}
                                {/* Categories */}
                                <div className="mt-2 border-t border-gray-100">
                                    {loading_categories ? (
                                        <CategoryNavLoading />
                                    ) : (
                                        <CategoryNav categories={categories} />
                                    )}
                                </div>

                                {/* Free Delivery Info */}
                                <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={freeDelivery}
                                            alt="Delivery Truck"
                                            className="w-12 h-10"
                                        />
                                        <span className="text-xs text-gray-600">
                                            {t("from_2,000_birr")}
                                            <br />
                                            <strong>
                                                {t("Addis_ababa_only")}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Categories */}
                <div className="hidden xl:block  justify-between">
                    <CategoryNav categories={categories} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
