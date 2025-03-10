import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";
import { Package } from "../types/product";
import { SortOption } from "../components/packagesComponents/filters/SortFilter";

interface UsePackagesByTagProps {
    tagId: number | undefined;
    initialItemsToLoad?: number;
    searchName?: string;
}

export interface Tag {
    id: number;
    name: string;
    name_am: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

const ITEMS_PER_PAGE = 10;

// Fetch all tags
const fetchTags = async ({
    pageParam = 1,
}: {
    pageParam?: number;
}): Promise<Tag[]> => {
    const response = await api.get(`/tags?page=${pageParam}`);
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data.data;
};

// Hook to manage tags and package retrieval
export const useTag = () => {
    const { i18n } = useTranslation();

    // Fetch all tags
    const {
        data: tagData,
        isLoading: isTagsLoading,
        isError: isTagsError,
        error: tagsError,
        fetchNextPage: fetchMoreTags,
        hasNextPage: hasMoreTags,
    } = useInfiniteQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === ITEMS_PER_PAGE
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 60,
        retry: 3,
    });

    // Process tags with localization support
    const tags = useMemo(() => {
        const allTags = tagData?.pages.flat() || [];
        return allTags.map((tag) => ({
            ...tag,
            name: i18n.language === "am" ? tag.name_am : tag.name,
        }));
    }, [tagData, i18n.language]);

    // Function to fetch packages for a specific tag
    const usePackagesByTag = ({
        tagId,
        initialItemsToLoad = 10,
        searchName = "",
    }: UsePackagesByTagProps) => {
        const { i18n } = useTranslation();
        const [minPrice, setMinPrice] = useState(0);
        const [maxPrice, setMaxPrice] = useState(1000000);
        const [sortBy, setSortBy] = useState<SortOption["value"]>("created_at");

        const getUrl = (page: number) => {
            let url = `/tags/${tagId}/packages?page=${page}&paginate=${initialItemsToLoad}`;
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
            enabled: !!tagId,
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
                name:
                    i18n.language === "am" ? pkg.name_am ?? pkg.name : pkg.name,
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

    return {
        tags,
        isTagsLoading,
        tagsError: isTagsError ? (tagsError as Error).message : null,
        hasMoreTags,
        loadMoreTags: fetchMoreTags,
        usePackagesByTag, // Function to fetch packages dynamically
    };
};
