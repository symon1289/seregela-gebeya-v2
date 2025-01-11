//TODO without refetching all the data we have translated data
import { useState, useEffect } from "react";
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

const ITEMS_PER_PAGE = 10; // Number of items per page

export const useCategory = () => {
  const { i18n } = useTranslation(); 
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]); // Store original untranslated data
  const [categories, setCategories] = useState<Category[]>([]); // Store translated data
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Indicates if more items are available
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from the API
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(
          `/categories?page=${page}`
        );

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (isMounted) {
          const newCategories = response.data.data as Category[];

        
          setHasMore(newCategories.length === ITEMS_PER_PAGE);

                  if (page > 1) {
            setOriginalCategories((prevCategories) => [
              ...prevCategories,
              ...newCategories,
            ]);
          } else {
            
            setOriginalCategories(newCategories);
          }
        }
      } catch (error: any) {
        if (isMounted) {
          console.error("Error fetching categories:", error);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [page]); 

  useEffect(() => {
    const translatedCategories = originalCategories.map((category) => ({
      ...category,
      name: i18n.language === "am" ? category.name_am : category.name, 
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        name: i18n.language === "am" ? subcategory.name_am || subcategory.name : subcategory.name, 
      })),
    }));

    setCategories(translatedCategories);
  }, [i18n.language, originalCategories]); 

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return {
    categories,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
};