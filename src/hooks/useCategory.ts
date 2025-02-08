import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "../utils/axios";

export interface Category {
    id: number;
    name: string;
    name_am: string;
    products_count: number;
    subcategories: Subcategory[];
    image_path: string;
}

interface Subcategory {
    id: number;
    name: string;
    name_am: string | null;
    products_count: number;
}

const ITEMS_PER_PAGE = 10;

const fetchCategories = async ({
    pageParam = 1,
}: {
    pageParam?: number;
}): Promise<Category[]> => {
    const response = await api.get(`/categories?page=${pageParam}`);
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data.data;
};

export const useCategory = () => {
    const { i18n } = useTranslation();

    const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["categories"],
            queryFn: fetchCategories,
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length === ITEMS_PER_PAGE
                    ? allPages.length + 1
                    : undefined;
            },
            initialPageParam: 1,
            staleTime: 1000 * 60 * 60,
            retry: 3,
        });

    const categories = useMemo(() => {
        const allCategories = data?.pages.flat() || [];
        return allCategories.map((category) => ({
            ...category,
            name: i18n.language === "am" ? category.name_am : category.name,
            subcategories: category.subcategories.map((subcategory) => ({
                ...subcategory,
                name:
                    i18n.language === "am"
                        ? subcategory.name_am || subcategory.name
                        : subcategory.name,
            })),
        }));
    }, [data, i18n.language]);

    return {
        categories,
        isLoading,
        error: isError ? (error as Error).message : null,
        hasMore: hasNextPage,
        loadMore: fetchNextPage,
    };
};
