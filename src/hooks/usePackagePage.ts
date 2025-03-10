import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";
import { Package } from "../types/product";
import { SortOption } from "../components/packagesComponents/filters/SortFilter";

interface UsePackagesPageProps {
    tagId?: number | undefined;
    initialItemsToLoad?: number;
    searchName?: string;
}

export const usePackagesPage = ({
    tagId,
    initialItemsToLoad = 10,
    searchName = "",
}: UsePackagesPageProps) => {
    const { i18n } = useTranslation();
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [sortBy, setSortBy] = useState<SortOption["value"]>("created_at");

    const getUrl = (page: number) => {
        let url = `packages?page=${page}&paginate=${initialItemsToLoad}`;
        if (searchName) {
            url += `&name=${encodeURIComponent(searchName)}`;
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
            "packages",
            tagId,
            initialItemsToLoad,
            searchName,
            minPrice,
            maxPrice,
        ],
        queryFn: async ({ pageParam = 1 }) => {
            const url = getUrl(pageParam);
            if (!url) return { data: [], nextPage: null };

            const response = await api.get(url);
            const packages = response.data.data.map(
                (pkg: any): Package => ({
                    id: pkg.id,
                    name: pkg.name,
                    name_am: pkg.name_am,
                    created_at: pkg.created_at,
                    updated_at: pkg.updated_at,
                    price: pkg.price,
                    discount: pkg.discount,
                    image_paths: pkg.image_paths,
                    left_in_stock: pkg.left_in_stock,
                    stores: pkg.stores,
                    total_quantity: pkg.total_quantity,
                    max_quantity_per_order: pkg.max_quantity_per_order,
                    image_path: pkg.image_path,
                    thumbnail_image_paths: pkg.thumbnail_image_paths,
                    tag_id: pkg.tag_id,
                    products: pkg.products,
                    is_active: pkg.is_active,
                })
            );

            return {
                data: packages,
                nextPage:
                    packages.length === initialItemsToLoad
                        ? pageParam + 1
                        : null,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: true,
    });

    const allPackages = useMemo(
        () => data?.pages.flatMap((page) => page.data) ?? [],
        [data]
    );

    const filteredPackages = useMemo(() => {
        const filtered = allPackages;

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "price":
                    return parseFloat(a.price) - parseFloat(b.price);
                case "-price":
                    return parseFloat(b.price) - parseFloat(a.price);
                case "created_at":
                default:
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    );
            }
        });

        return filtered.map((pkg) => ({
            ...pkg,
            name: i18n.language === "am" ? pkg.name_am ?? pkg.name : pkg.name,
        }));
    }, [allPackages, sortBy, i18n.language]);

    const loadMore = () => {
        if (!isFetchingNextPage && hasNextPage) {
            fetchNextPage();
        }
    };
    const handlePriceChange = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
    };
    const handleSortChange = (value: SortOption["value"]) => {
        setSortBy(value);
    };

    return {
        packages: allPackages,
        filteredPackages,
        isLoading,
        error,
        hasMore: !!hasNextPage,

        minPrice,
        maxPrice,
        sortBy,
        loadMore,
        handlePriceChange,
        handleSortChange,
        isFetchingNextPage,
    };
};
