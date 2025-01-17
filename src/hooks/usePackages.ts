import { useTranslation } from "react-i18next";
import api from '../utils/axios';
import { Product } from '../types/product';
import { Package } from './../types/product';
import { useState, useMemo } from "react";

interface UsePackagesReturn {
  isLoading: boolean;
  error: string | null;
  popularProducts: Product[];
  product: Product | null;
  packages: Package[];
  package: Package | null;
  getPopularProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getPackages: () => Promise<void>;
  getPackageById: (id: string) => Promise<void>;
}

export const usePackages = (): UsePackagesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawPopularProducts, setRawPopularProducts] = useState<Product[]>([]);
  const [rawProduct, setRawProduct] = useState<Product | null>(null);
  const [rawPackages, setRawPackages] = useState<Package[]>([]);
  const [rawPackageItem, setRawPackageItem] = useState<Package | null>(null);

  const { i18n } = useTranslation();

  // Translate popular products
  const popularProducts = useMemo(() => 
    rawPopularProducts.map((product) => ({
      ...product,
      name: (i18n.language === "am" ? product.name_am : product.name) ?? '',
      description: (i18n.language === "am" ? product.description_am : product.description) ?? '',
    })),
    [rawPopularProducts, i18n.language]
  );

  // Translate single product
  const product = useMemo(() => 
    rawProduct
      ? {
          ...rawProduct,
          name: (i18n.language === "am" ? rawProduct.name_am : rawProduct.name) ?? '',
          description: (i18n.language === "am" ? rawProduct.description_am : rawProduct.description) ?? '',
        }
      : null,
    [rawProduct, i18n.language]
  );

  // Translate packages
  const packages = useMemo(() => 
    rawPackages.map((pkg) => ({
      ...pkg,
      name: (i18n.language === "am" ? pkg.name_am : pkg.name) ?? '',
    })),
    [rawPackages, i18n.language]
  );

  // Translate single package
  const packageItem = useMemo(() => 
    rawPackageItem
      ? {
          ...rawPackageItem,
          name: (i18n.language === "am" ? rawPackageItem.name_am : rawPackageItem.name) ?? '',
        }
      : null,
    [rawPackageItem, i18n.language]
  );

  const getPopularProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get('popular-products');
      setRawPopularProducts(res.data.data);
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
      setRawProduct(res.data.data);
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
      setRawPackages(res.data.data);
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
      setRawPackageItem(res.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch package');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    popularProducts,
    product,
    packages,
    package: packageItem,
    getPopularProducts,
    getProductById,
    getPackages,
    getPackageById,
  };
};
