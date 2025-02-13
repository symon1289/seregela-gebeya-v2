import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import defaultImage from "../assets/no-image-available-02.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePopular } from "../hooks/usePopular";
import ProductCardLoading from "./loading skeletons/product/Card";

const GrabOurBestDeals = () => {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const previousCountRef = useRef(0);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const {
        filteredProducts: bestDeals,
        loadMore,
        hasMore,
        isLoading,
        isFetchingNextPage: loadingMore,
    } = usePopular({
        id: undefined,
        endpoint: "popular-products",
        initialItemsToLoad: 7,
    });

    useEffect(() => {
        if (bestDeals.length > previousCountRef.current) {
            const previousCount = previousCountRef.current;
            previousCountRef.current = bestDeals.length; // Update ref before scrolling

            requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    const firstNewProduct = container.children[
                        previousCount
                    ] as HTMLElement;
                    if (firstNewProduct) {
                        firstNewProduct.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "start",
                        });
                    }
                }
            });
        }
    }, [bestDeals]);

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };
    const checkScrollability = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft + container.clientWidth <
                    container.scrollWidth
            );
        }
    };
    useEffect(() => {
        checkScrollability();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollability);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", checkScrollability);
            }
        };
    }, [bestDeals]);

    return (
        <section className="mb-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl leading-[19px] font-semibold">
                    {t("best_selling_items")}
                </h2>
                {!loadingMore && hasMore && (
                    <button
                        aria-label="Load More"
                        onClick={loadMore}
                        className="bg-[#e9a83a] hover:bg-[#fed874] text-white text-sm sm:text-base transition-colors py-2 px-4 rounded-lg font-semibold"
                    >
                        {t("loadMore")}
                    </button>
                )}
                {loadingMore && (
                    <div className="flex justify-center ">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9a83a]"></div>
                    </div>
                )}
            </div>
            <div className="relative">
                {canScrollLeft && (
                    <button
                        aria-label="Left"
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                    >
                        <ChevronLeft />
                    </button>
                )}
                {canScrollRight && (
                    <button
                        aria-label="Right"
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                    >
                        <ChevronRight />
                    </button>
                )}
                <div
                    ref={scrollContainerRef}
                    className="grid auto-cols-[10.5rem] grid-flow-col gap-3 overflow-x-auto"
                >
                    {loadingMore || isLoading
                        ? Array.from({ length: 14 }).map((_, index) => (
                              <ProductCardLoading key={index} />
                          ))
                        : bestDeals.map((product) => (
                              <ProductCard
                                  key={product.id}
                                  id={product.id}
                                  name={product.name}
                                  price={product.price}
                                  image={product.image || defaultImage}
                                  originalPrice={product.price}
                                  discount={
                                      product.discount
                                          ? Number(product.discount)
                                          : undefined
                                  }
                                  left_in_stock={product.left_in_stock}
                              />
                          ))}
                </div>
            </div>
        </section>
    );
};

export default GrabOurBestDeals;
