import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardList from "../components/ProductCardList";
import Sidebar from "../components/filters/Sidebar";
import { useProducts } from "../hooks/useProducts";
import Meta from "../components/Meta";
import { getAllProductsMetaTags, getSearchMetaTags } from "../config/meta";
import Breadcrumb from "../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import ProductCardLoading from "../components/loading skeletons/product/Card.tsx";
import defaultImage from "../assets/no-image-available-02.jpg";
import { List, Grid3x3 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getLeftInStock } from "../utils/helper";
import ProductCardListSkeleton from "../components/loading skeletons/product/ProductCardListSkeleton.tsx";
const Products: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);

    const searchParams = new URLSearchParams(location.search);
    const searchName = searchParams.get("name") || "";
    const [layout, setLayout] = useState<"grid" | "list">(
        searchName ? "list" : "grid"
    );
    const {
        filteredProducts,
        isLoading,
        error,
        hasMore,
        minPrice,
        maxPrice,
        sortBy,
        loadMore,
        handlePriceChange,
        handleSortChange,
    } = useProducts({
        id: undefined,
        endpoint: "products",
        searchName,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {" "}
            {searchName && <Meta config={getSearchMetaTags(searchName)} />}
            {!searchName && <Meta config={getAllProductsMetaTags()} />}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Breadcrumb
                    paths={[
                        {
                            name: "Products",
                            url: "/products",
                        },
                    ]}
                />
                <div className="flex gap-[11px] mt-6">
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(!isSidebarOpen)}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onPriceChange={handlePriceChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                    />

                    <div className="flex-1">
                        <div className="flex justify-end mb-4 gap-2">
                            <button
                                onClick={() => setLayout("grid")}
                                className={`px-2 py-1 rounded-lg text-gray-700 ${
                                    layout === "grid"
                                        ? "bg-primary text-white"
                                        : ""
                                }`}
                            >
                                <Grid3x3 size={18} />
                            </button>
                            <button
                                onClick={() => setLayout("list")}
                                className={`px-2 py-1 rounded-lg text-gray-700 ${
                                    layout === "list"
                                        ? "bg-primary text-white"
                                        : ""
                                }`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {isLoading ? (
                            <div
                                className={
                                    layout === "grid"
                                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[11px]"
                                        : "space-y-4"
                                }
                            >
                                {layout === "grid"
                                    ? Array.from({ length: 15 }).map(
                                          (_, index) => (
                                              <ProductCardLoading key={index} />
                                          )
                                      )
                                    : Array.from({ length: 15 }).map(
                                          (_, index) => (
                                              <ProductCardListSkeleton
                                                  key={index}
                                              />
                                          )
                                      )}
                            </div>
                        ) : (
                            <div
                                className={
                                    layout === "grid"
                                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[11px]"
                                        : "space-y-4"
                                }
                            >
                                {filteredProducts.map((product) =>
                                    layout === "grid" ? (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            image={
                                                product.image || defaultImage
                                            }
                                            originalPrice={
                                                product.originalPrice
                                            }
                                            discount={
                                                product.discount
                                                    ? Number(product.discount)
                                                    : undefined
                                            }
                                            left_in_stock={
                                                getLeftInStock(user, product) ??
                                                0
                                            }
                                        />
                                    ) : (
                                        <ProductCardList
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            image={
                                                product.image || defaultImage
                                            }
                                            originalPrice={
                                                product.originalPrice
                                            }
                                            discount={
                                                product.discount
                                                    ? Number(product.discount)
                                                    : undefined
                                            }
                                            left_in_stock={
                                                getLeftInStock(user, product) ??
                                                0
                                            }
                                            max_quantity_per_order={
                                                product?.max_quantity_per_order
                                            }
                                            description={product.description}
                                        />
                                    )
                                )}
                            </div>
                        )}

                        {isLoading &&
                            Array.from({ length: 15 }).map((_, index) => (
                                <ProductCardLoading key={index} />
                            ))}

                        {!isLoading && hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-[#d49732] transition-colors"
                                >
                                    {t("loadMore")}
                                </button>
                            </div>
                        )}

                        {!isLoading &&
                            !hasMore &&
                            filteredProducts.length === 0 && (
                                <div className="text-center mt-8 text-gray-500">
                                    {t("no_items_via_this_filter")}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Products;
