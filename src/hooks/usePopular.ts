import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Product } from "../types/product";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";

interface UsePopularProps {
    id: number | undefined;
    endpoint: "popular-products" | "personalized-products" | "products";
    initialItemsToLoad?: number;
    searchName?: string;
}

interface UsePopularReturn {
    products: Product[];
    filteredProducts: Product[];
    isLoading: boolean;
    error: Error | null;
    hasMore: boolean;
    page: number;
    minPrice: number;
    maxPrice: number;
    loadMore: () => void;
    handlePriceChange: (min: number, max: number) => void;
    isFetchingNextPage: boolean;
}
const getAuthHeader = () => ({
    headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
    },
});
export const usePopular = ({
    id,
    endpoint,
    initialItemsToLoad = 15,
    searchName = "",
}: UsePopularProps): UsePopularReturn => {
    const { i18n } = useTranslation();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);

    const getUrl = (page: number) => {
        let url = "";
        if (endpoint === "products") {
            url = `products?page=${page}&paginate=${initialItemsToLoad}`;
            if (searchName) {
                url += `&name=${encodeURIComponent(searchName)}`;
            }
        } else if (id) {
            url = `products/${id}`;
        } else {
            url = `${endpoint}?page=${page}&paginate=${initialItemsToLoad}`;
        }
        url += `&price[gte]=${minPrice}&price[lte]=${maxPrice}`;
        return url;
    };

    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [
            "products",
            endpoint,
            id,
            initialItemsToLoad,
            searchName,
            minPrice,
            maxPrice,
        ],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const url = getUrl(pageParam);
                if (!url) return { data: [], nextPage: null };

                const response = await api.get(url, getAuthHeader());
                const products = response.data.data.map(
                    (product: any): Product => ({
                        id: parseInt(product.id),
                        name: product.name,
                        name_am: product.name_am,
                        price: product.price,
                        discount: product.discount.toString(),
                        image: product.image_paths?.[0] || "",
                        created_at: product.created_at,
                        originalPrice: (
                            parseFloat(product.price) *
                            (1 + parseFloat(String(product.discount)) / 100)
                        ).toFixed(2),
                        unit: product.measurement_type,
                        left_in_stock: product.left_in_stock,
                        description: product.description,
                        description_am: product.description_am,
                        supplier: product.supplier,
                        brand: product.brand,
                        measurement_type: product.measurement_type,
                        category_id: product.category_id,
                        category: product.category,
                        subcategory: product.subcategory,
                        subcategory_id: product.subcategory_id,
                        stores: product.stores,
                        total_quantity: product.total_quantity,
                        rating: product.rating,
                        is_non_stocked: product.is_non_stocked,
                        is_active: product.is_active,
                        image_paths: product.image_paths,
                        updated_at: product.updated_at,
                        max_quantity_per_order: product.max_quantity_per_order,
                    })
                );

                return {
                    data: products,
                    nextPage:
                        products.length === initialItemsToLoad
                            ? pageParam + 1
                            : null,
                };
            } catch (error) {
                console.error("Error fetching products:", error);
                return { data: [], nextPage: null };
            }
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: Boolean(
            endpoint &&
                (endpoint === "products" ||
                    id ||
                    endpoint === "popular-products" ||
                    endpoint === "personalized-products")
        ),
    });

    const allProducts = useMemo(
        () => data?.pages.flatMap((page) => page.data) ?? [],
        [data]
    );

    const filteredProducts = useMemo(() => {
        const sortedProducts = [...allProducts]; // Ensure no mutation

        return sortedProducts.map((product) => ({
            ...product,
            name:
                (i18n.language === "am" ? product.name_am : product.name) ?? "",
            description:
                (i18n.language === "am"
                    ? product.description_am
                    : product.description) ?? "",
        }));
    }, [allProducts, i18n.language]);
    const loadMore = () => {
        if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
        }
    };

    return {
        products: allProducts,
        filteredProducts,
        isLoading,
        error,
        hasMore: !!hasNextPage,
        page: data?.pages.length ?? 1,
        minPrice,
        maxPrice,
        loadMore,
        handlePriceChange: (min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
        },
        isFetchingNextPage,
    };
};
