import React, { useEffect } from "react";
import { usePackages } from "../../hooks/usePackages";
import ProductSection from "./ProductSection";
import sidde from "../../assets/side.jpg";
import { useSelector } from "react-redux";
import { selectRecentProducts } from "../../store/features/productSlice";
import { useProducts } from "../../hooks/useProducts";
import { useTranslation } from "react-i18next";
import { RootState } from "../../store/store";
import { getLeftInStock } from "../../utils/helper";

const ProductGrid: React.FC = () => {
    const { t } = useTranslation();
    const {
        isLoadingPopularProducts,
        popularProductsError,
        popularProductsForGrid,
        getPopularProductsForProductGrid,
    } = usePackages();
    const { filteredProducts: newArrivals, isLoading: newArrivalsLoading } =
        useProducts({
            id: undefined,
            endpoint: "products",
            initialItemsToLoad: 18,
        });
    const recentProducts = useSelector(selectRecentProducts);
    useEffect(() => {
        getPopularProductsForProductGrid(18, 1);
    }, []);
    const { user } = useSelector((state: RootState) => state.auth);
    if (popularProductsError) {
        return (
            <div className="flex flex-col items-center space-y-4 py-8">
                <div className="text-red-500">
                    Error: {popularProductsError.message}
                </div>
                <button
                    onClick={() => getPopularProductsForProductGrid(18, 1)}
                    className="px-4 py-2 bg-[#e7a334] text-white rounded hover:bg-secondary transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex container mx-auto py-4">
            {/* Static Image Section */}
            <div className="hidden lg:block w-full md:w-1/4  mb-6  justify-center items-center">
                <img
                    src={sidde}
                    alt="Static Image"
                    className="w-full h-full object-cover rounded-lg shadow-xl"
                />
            </div>

            {/* ProductSection Components */}
            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* New Arrivals Section */}

                <ProductSection
                    title={t("new_arrivals")}
                    products={
                        newArrivals.map((product) => ({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            image: product.image_paths[0],
                            image_paths: product.image_paths,
                            discount: product.discount,
                            max_quantity_per_order:
                                product.max_quantity_per_order,
                            left_in_stock: getLeftInStock(user, product) ?? 0,
                        })) || []
                    }
                    intervalTime={5000}
                    loading={newArrivalsLoading}
                />

                <ProductSection
                    title={t("popular_products")}
                    products={popularProductsForGrid || []}
                    intervalTime={7000}
                    loading={isLoadingPopularProducts}
                />

                {/* Recently Viewed Products Section */}
                {recentProducts.length > 1 && (
                    <ProductSection
                        title={t("recently_viewed")}
                        products={
                            recentProducts.map((product) => ({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                originalPrice: product.originalPrice,
                                image: product.image_paths[0], // add this property
                                image_paths: product.image_paths, // add this property
                                left_in_stock:
                                    getLeftInStock(user, product) ?? 0,
                                discount: product.discount,
                                max_quantity_per_order:
                                    product.max_quantity_per_order,
                            })) || []
                        }
                        intervalTime={6000}
                        loading={isLoadingPopularProducts}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
