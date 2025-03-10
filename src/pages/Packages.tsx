import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCardList from "../components/packagesComponents/ProductCardList";
import PackageCardForGrid from "../components/packagesComponents/PackageCardForGrid";
import Meta from "../components/Meta";
import { getPackagesMetaTags, getSearchMetaTags } from "../config/meta";
import Breadcrumb from "../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import ProductCardLoading from "../components/loading skeletons/product/Card";
import defaultImage from "../assets/no-image-available-02.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getLeftInStock } from "../utils/helper";
import { usePackagesPage } from "../hooks/usePackagePage";
import FilterBar from "../components/packagesComponents/filters/FilterBar";
import PackageCardSkeleton from "../components/loading skeletons/package/PackageCardSkeleton";
import PackageCardSkeletonForList from "../components/loading skeletons/package/PackageCardSkeletonForList";

type ViewMode = "grid" | "list";

const Packages: React.FC = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useSelector((state: RootState) => state.auth);

    const searchParams = new URLSearchParams(location.search);
    const searchName = searchParams.get("name") || "";

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [layout, setLayout] = useState<ViewMode>(
        searchName ? "list" : "grid"
    );
    const {
        packages,
        isLoading,
        error,
        hasMore,
        minPrice,
        maxPrice,
        sortBy,
        loadMore,
        handlePriceChange,
        handleSortChange,
    } = usePackagesPage({
        tagId: undefined,
        searchName: debouncedSearchQuery,
    });

    const handleLayoutChange = () => {
        setLayout(layout === "grid" ? "list" : "grid");
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const handleSearchQueryChange = (query: string) => {
        setSearchQuery(query);
    };
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
            {!searchName && <Meta config={getPackagesMetaTags()} />}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Breadcrumb
                    paths={[
                        {
                            name: "Packages",
                            url: "/packages",
                        },
                    ]}
                />
                <FilterBar
                    className=" top-4 "
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={handlePriceChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    activeView={layout}
                    onChange={handleLayoutChange}
                    onSearchChange={handleSearchQueryChange}
                />
                <div className="flex gap-[11px] ">
                    <div className="flex-1">
                        {isLoading ? (
                            <div
                                className={
                                    layout === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[11px] 2xl:grid-cols-4 items-start"
                                        : "space-y-4"
                                }
                            >
                                {layout === "grid"
                                    ? Array.from({ length: 10 }).map(
                                          (_, index) => (
                                              <PackageCardSkeleton
                                                  key={index}
                                              />
                                          )
                                      )
                                    : Array.from({ length: 10 }).map(
                                          (_, index) => (
                                              <PackageCardSkeletonForList
                                                  key={index}
                                              />
                                          )
                                      )}
                            </div>
                        ) : (
                            <div
                                className={
                                    layout === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[11px] 2xl:grid-cols-4 items-start"
                                        : "space-y-4"
                                }
                            >
                                {packages.map((product) =>
                                    layout === "grid" ? (
                                        <PackageCardForGrid
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            image={
                                                product.image_path ||
                                                defaultImage
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
                                            image_path={
                                                product.image_path ||
                                                defaultImage
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
                                            products={product.products}
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

                        {!isLoading && !hasMore && packages.length === 0 && (
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

export default Packages;
