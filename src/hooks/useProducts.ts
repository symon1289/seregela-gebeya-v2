import { Package } from './../types/product';

import { useState, useEffect } from 'react';
import { SortOption } from '../components/filters/SortFilter';
import { Product,  } from '../types/product';
import { useTranslation } from "react-i18next";
import api from '../utils/axios';

interface UseProductsProps {
  id: number | undefined;
  endpoint: 'categories' | 'subcategories' | 'products';
  initialItemsToLoad?: number;
  searchName?: string;
}

interface UseProductsReturn {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption['value'];
  loadMore: () => void;
  handlePriceChange: (min: number, max: number) => void;
  handleSortChange: (value: SortOption['value']) => void;
  popularProducts: Product[];
  product: Product | null;
  packages: Package[]; 
  package: Package | null; 
  getPopularProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getPackages: () => Promise<void>;
  getPackageById: (id: string) => Promise<void>;
}

export const useProducts = ({
  id,
  endpoint,
  initialItemsToLoad = 15,
  searchName = ''
}: UseProductsProps): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState<SortOption['value']>("created_at");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { i18n } = useTranslation();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [packages, setPackages] = useState<Package[]>([]); 
  const [packageItem, setPackageItem] = useState<Package | null>(null); 
  useEffect(() => {
    let isMounted = true;

    if (page === 1) {
      setProducts([]);
      setHasMore(true);
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let url = import.meta.env.VITE_API_BASE_URL + '/';

        if (endpoint === 'products') {
          url += `products?page=${page}&paginate=${initialItemsToLoad}`;
          if (searchName) {
            url += `&name=${encodeURIComponent(searchName)}`;
          }
        } else if (id) {
          url += `${endpoint}/${id}/products?page=${page}&paginate=${initialItemsToLoad}`;
        } else {
          return;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          if (data.data && Array.isArray(data.data)) {
            const newProducts = data.data.map((product: any): Product => ({
              id: parseInt(product.id),
              name: product.name,
              name_am: product.name_am,
              price: product.price,
              discount: product.discount.toString(),
              image: product.image_paths[0],
              created_at: product.created_at,
              originalPrice: product.price,
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
              updated_at: product.updated_at
            }));

            setHasMore(newProducts.length === initialItemsToLoad);
            setProducts((prevProducts) =>
              page === 1 ? newProducts : [...prevProducts, ...newProducts]
            );
          } else {
            throw new Error("Invalid data format received from API");
          }
        }
      } catch (error: any) {
        if (isMounted) {
          console.error("Error fetching products:", error);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [id, endpoint, page, initialItemsToLoad, searchName]);

  // Filter and sort products
  useEffect(() => {
    const filtered = [...products].filter(product => {
      const productPrice = parseFloat(product.price);
      return productPrice >= minPrice && productPrice <= maxPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case '-price':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredProducts(filtered);
  }, [products, minPrice, maxPrice, sortBy]);

  // Translate products when the language changes
  useEffect(() => {
    const translatedProducts = products.map((product) => ({
      ...product,
      name: (i18n.language === "am" ? product.name_am : product.name) ?? '',
      description: (i18n.language === "am" ? product.description_am : product.description) ?? '',
    }));
  
    setFilteredProducts(translatedProducts);
  }, [products, i18n.language]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSortChange = (value: SortOption['value']) => {
    setSortBy(value);
  };

  const getPopularProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('popular-products');
      setPopularProducts(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch popular products');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`products/${id}`);
      setProduct(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  };

  

  const getPackages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('packages');
      setPackages(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch packages');
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`packages/${id}`);
      setPackageItem(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch package');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    filteredProducts,
    isLoading,
    error,
    hasMore,
    page,
    minPrice,
    maxPrice,
    sortBy,
    loadMore,
    handlePriceChange,
    handleSortChange,
    popularProducts,
    product,
    packages,
    package: packageItem,
    getPopularProducts,
    getProductById,
    getPackages,
    getPackageById
    
  };
};