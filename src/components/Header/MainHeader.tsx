import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, X, Menu } from "lucide-react";
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

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    searchName: searchQuery,
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
    })
  );
  const userData = localStorage.getItem("user");
  const { first_name, last_name } = userData
    ? JSON.parse(userData)
    : { first_name: "", last_name: "" };
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount =
    cartItems?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const packagesitems = useSelector((state: RootState) => state.cart.packages);
  const packagecount =
    packagesitems?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const { categories } = useCategory();
  const { t } = useTranslation();
  const { grandTotal } = calculateCartTotals(cartItems, packagesitems);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsSearchOpen(true);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearchOpen(false);
    navigate(
      `/seregela-gebeya-v2/products?name=${encodeURIComponent(searchQuery)}`
    );
  };

  const handleResultClick = (product: Product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/seregela-gebeya-v2/products/${product.id}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchQuery) {
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <nav
      className={`bg-[#e7a334]  shadow-black/15 text-white pb-2 pt-3 sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled ? "shadow-xl pb-1.5 pt-2 " : ""
      }`}
    >
      <div className="max-w-screen-xl mx-auto pr-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="block sm:block md:hidden lg:hidden xl:hidden text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link
              to="/seregela-gebeya-v2"
              className="flex items-center justify-end h-[65px] w-[80px] md:w-[180px] lg:w-[220px]"
            >
              <img src={logomini} alt="Logo" className="w-[80px] h-[60px]" />
              <div className="hidden md:flex md:flex-col lg:flex lg:flex-col lg:h-[23px] md:h-[23px] text-black ">
                <p className="logo-english">SeregelaGebeya</p>
                <p className="logo-amharic">ሠረገላ ገበያ</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t("search")}
                  className="w-full px-10 py-2 rounded-full text-gray-900 focus:outline-none border border-transparent focus:border-[#e7a334]"
                />

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="absolute right-3 top-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Search Results */}
                {isSearchOpen && searchResults.length > 0 && !isLoading && (
                  <div className="absolute top-full left-0 right-0 mt-0 bg-white rounded-lg shadow-lg z-[100] max-h-96 overflow-y-auto">
                    <ul className="py-2">
                      {searchResults.map((product) => (
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          key={product.id}
                          onClick={() => handleResultClick(product)}
                        >
                          <img
                            src={product.image}
                            className="w-10 h-10 object-cover rounded"
                            alt={product.name}
                          />
                          <div>
                            <div className="text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600">
                              <PriceFormatter
                                price={product.price.toString()}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No Results Message */}
                {isSearchOpen &&
                  searchQuery &&
                  searchResults.length === 0 &&
                  !isLoading && (
                    <div className="absolute top-full left-0 right-0 mt-0 bg-white rounded-lg shadow-lg z-[100]">
                      <div className="px-4 py-3 text-gray-600 text-center">
                        No products found for "{searchQuery}"
                      </div>
                    </div>
                  )}
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {userData ? (
              <Link
                to="/seregela-gebeya-v2/profile"
                className="hidden xl:flex hover:text-gray-200 bg-[#e7a334] rounded-lg px-2 py-2 text-white items-center gap-2"
              >
                <FaUserAlt size={24} />
              </Link>
            ) : (
              <Link
                to="/seregela-gebeya-v2/login"
                className="hidden xl:flex hover:text-gray-200 bg-white rounded-lg px-2 py-2 text-[#e7a334] items-center gap-2"
              >
                <User size={24} />
                <span>{t("login")}</span>
              </Link>
            )}
            {/* Cart */}
            <Link
              to="/seregela-gebeya-v2/cart"
              className="relative hover:text-gray-200 text-white rounded-lg px-1 py-2 "
            >
              <FaCartShopping size={24} />
              {itemCount + packagecount > 0 && (
                <span className="absolute -top-1 -right-0  bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount + packagecount}
                </span>
              )}
            </Link>

            {grandTotal > 100 && (
              <div className="ml-4 hidden sm:flex flex-col font-bold">
                <span className="text-xs text-gray-100">{t("your_cart")}</span>
                <PriceFormatter price={grandTotal.toString()} />
              </div>
            )}
            {grandTotal === 100 && (
              <div className="ml-4 hidden sm:flex flex-col font-bold">
                <span className="text-xs text-gray-100">{t("your_cart")}</span>
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
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full "
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
                    to="/seregela-gebeya-v2"
                    className="flex items-center h-[61px] w-[80px] lg:w-[220px]"
                  >
                    <img src={logomini} alt="Logo" className="object-cover" />
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-primary hover:bg-secondary rounded-full text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {/* Account Link */}
                {userData ? (
                  <Link
                    to="/seregela-gebeya-v2/profile"
                    className="hidden xl:flex hover:text-gray-200 bg-white rounded-lg px-4 py-2 text-[#e7a334] items-center gap-2"
                  >
                    <User size={24} />
                    <span>{first_name}</span>
                    <span>{last_name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/seregela-gebeya-v2/login"
                    className="flex items-center  gap-3 py-3 text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={28} />
                    <span>{t("login")}</span>
                  </Link>
                )}
                {/* Categories */}
                <div className="mt-2 border-t border-gray-100">
                  <CategoryNav categories={categories} />
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
                      <strong>{t("Addis_ababa_only")}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Categories */}
        <div className="hidden xl:block mt-4 justify-between">
          <CategoryNav categories={categories} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
