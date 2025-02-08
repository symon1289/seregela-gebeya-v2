import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/product';
import defaultImage from '../assets/no-image-available-02.jpg';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const GrabOurBestDeals = () => {
    const { t } = useTranslation();
    const [grabOurBestDeals, setGrabOurBestDeals] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const initialItemsToLoad = 7;

    const formatPrice = (price: string | number): number => {
        const num = typeof price === 'string' ? parseFloat(price) : price;
        return +num.toFixed(2);
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
        const fetchGrabOurBestDeals = async () => {
            setLoadingMore(true);
            try {
                const response = await fetch(
                    import.meta.env.VITE_API_BASE_URL +
                        `/popular-products?page=${page}&paginate=${initialItemsToLoad}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setHasMore(data.meta.last_page > (page === 1 ? 1 : page)); // Adjust hasMore logic

                const fetchedProducts: Product[] = data.data.map(
                    (item: any) => ({
                        id: item.id,
                        name: item.name,
                        price: formatPrice(item.price),
                        discount: parseFloat(item.discount),
                        image:
                            item.image_paths && item.image_paths.length > 0
                                ? item.image_paths[0]
                                : defaultImage,
                        unit: item.measurement_type,
                        originalPrice: parseFloat(item.price),
                        created_at: item.created_at,
                    })
                );

                const previousCount = grabOurBestDeals.length;

                if (page === 1) {
                    setGrabOurBestDeals(
                        fetchedProducts.slice(0, initialItemsToLoad)
                    );
                } else {
                    setGrabOurBestDeals((prevSavers) => [
                        ...prevSavers,
                        ...fetchedProducts,
                    ]);

                    setTimeout(() => {
                        const container = scrollContainerRef.current;
                        if (container) {
                            const firstNewProduct = container.children[
                                previousCount
                            ] as HTMLElement;
                            if (firstNewProduct) {
                                firstNewProduct.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'nearest', // Prevent vertical scrolling
                                    inline: 'start',
                                });
                            }
                        }
                    }, 0);
                }
            } catch (error) {
                console.error('Error fetching fresh savers:', error);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchGrabOurBestDeals();
    }, [page]);

    useEffect(() => {
        checkScrollability();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollability);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollability);
            }
        };
    }, [grabOurBestDeals]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };
    return (
        <section className="mb-0 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="explore-more-deals font-semibold mb-6">
                    {t('best_selling_items')}
                </h2>
                {!loadingMore && hasMore && (
                    <button
                        onClick={loadMore}
                        className="bg-[#e9a83a] hover:bg-[#fed874] text-white transition-colors py-2 px-4 rounded-lg font-semibold"
                    >
                        {t('loadMore')}
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
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                    >
                        <ChevronLeft />
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                    >
                        <ChevronRight />
                    </button>
                )}
                <div
                    ref={scrollContainerRef}
                    className="grid auto-cols-[10.5rem] grid-flow-col gap-3 overflow-x-auto "
                >
                    {grabOurBestDeals.map((product) => (
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

            {!loadingMore && !hasMore && (
                <div className="text-center">
                    {/* <p className="text-gray-600 text-lg">No more products to load.</p> */}
                </div>
            )}
        </section>
    );
};

export default GrabOurBestDeals;
