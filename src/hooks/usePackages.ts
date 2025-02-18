import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/axios";
import { Product, Package } from "../types/product";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { PackageProduct } from "../types/product";

type ApiResponse<T> = {
    data: T;
    status: number;
};

type QueryKeys = {
    popularProducts: ["popularProducts", number, number];
    popularProductsForGrid: ["popularProductsForGrid", number, number];
    product: ["product", string];
    packages: ["packages"];
    package: ["package", string];
};
type Tail<T extends any[]> = T extends [any, ...infer U] ? U : never;

const createQueryKey = <T extends keyof QueryKeys>(
    key: T,
    ...params: Tail<QueryKeys[T]>
): QueryKeys[T] => [key, ...params] as unknown as QueryKeys[T];

interface UsePackagesReturn {
    isLoadingPopularProducts: boolean;
    isLoadingPopularProductsForGrid: boolean;
    isLoadingPackageItem: boolean;
    isLoadingProduct: boolean;
    isLoadingPackages: boolean;
    popularProductsError: Error | null;
    popularProductsForGridError: Error | null;
    packageItemError: Error | null;
    packagesError: Error | null;
    productError: Error | null;
    popularProducts: Product[];
    popularProductsForGrid: Product[];
    product?: Product;
    packages: Package[];
    package?: Package;
    getPopularProducts: (paginate: number, page: number) => void;
    getPopularProductsForProductGrid: (paginate: number, page: number) => void;
    getProductById: (id: string) => void;
    getPackages: () => void;
    getPackageById: (id: string) => void;
}

const getTranslatedField = (
    obj: any,
    field: string,
    language: string
): string => (language === "am" ? obj[`${field}_am`] || "" : obj[field] || "");

export const usePackages = (): UsePackagesReturn => {
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();
    const [packageId, setPackageId] = useState<string>("");
    const [popularProductsParams, setPopularProductsParams] = useState<{
        paginate: number;
        page: number;
    }>({
        paginate: 0,
        page: 0,
    });

    const popularProductsQuery = useQuery<ApiResponse<Product[]>, Error>({
        queryKey: createQueryKey("popularProducts", 0, 0),
        queryFn: async ({ queryKey }) => {
            const [, paginate, page] = queryKey;
            const response = await api.get(
                `popular-products?page=${page}&paginate=${paginate}`
            );
            return response;
        },
        enabled: false,
    });

    const popularProductsForGridQuery = useQuery<ApiResponse<Product[]>, Error>(
        {
            queryKey: createQueryKey(
                "popularProductsForGrid",
                popularProductsParams.paginate,
                popularProductsParams.page
            ), // Use the state variable
            queryFn: async ({ queryKey }) => {
                const [, paginate, page] = queryKey;
                console.log("Fetching popular products with:", {
                    paginate,
                    page,
                }); // Debugging
                const response = await api.get(
                    `popular-products?page=${page}&paginate=${paginate}`
                );
                const transformedData = response.data.data.map(
                    (product: any) => ({
                        id: product.id ?? "unknown",
                        name:
                            getTranslatedField(
                                product,
                                "name",
                                i18n.language
                            ) ?? "Unnamed Product",
                        originalPrice:
                            product.discount && product.discount !== "0.00"
                                ? (
                                      parseFloat(product.price) *
                                      (1 +
                                          parseFloat(String(product.discount)) /
                                              100)
                                  ).toFixed(2)
                                : product.price,

                        price: parseFloat(product.price || 0).toFixed(2),
                        image: product.image_paths ?? [],
                        left_in_stock:
                            product.max_quantity_per_order !== null
                                ? product.max_quantity_per_order
                                : product.left_in_stock,
                    })
                );
                return { ...response, data: transformedData };
            },
            enabled: false,
        }
    );

    const productQuery = useQuery<ApiResponse<Product>, Error>({
        queryKey: createQueryKey("product", ""),
        queryFn: async ({ queryKey }) => {
            const [, id] = queryKey;
            const response = await api.get(`products/${id}`);
            return response;
        },
        enabled: false,
    });

    const packagesQuery = useQuery<ApiResponse<Package[]>, Error>({
        queryKey: createQueryKey("packages"),
        queryFn: async () => {
            const response = await api.get("packages");
            return response;
        },
        enabled: false,
    });

    const packageItemQuery = useQuery<ApiResponse<Package>, Error>({
        queryKey: createQueryKey("package", packageId),
        queryFn: async ({ queryKey }) => {
            const [, id] = queryKey;
            if (!id) throw new Error("Package ID is required");
            const response = await api.get(`packages/${id}`);
            return response;
        },
        enabled: !!packageId,
    });

    const transformedData = useMemo(
        () => ({
            popularProducts:
                popularProductsQuery.data?.data?.map((product) => ({
                    ...product,
                    name: getTranslatedField(product, "name", i18n.language),
                    description: getTranslatedField(
                        product,
                        "description",
                        i18n.language
                    ),
                })) || [],
            popularProductsForGrid:
                popularProductsForGridQuery.data?.data || [],
            product: productQuery.data?.data && {
                ...productQuery.data.data,
                name: getTranslatedField(
                    productQuery.data.data,
                    "name",
                    i18n.language
                ),
                description: getTranslatedField(
                    productQuery.data.data,
                    "description",
                    i18n.language
                ),
            },
            // @ts-expect-error packagesQuery is not an array
            packages: Array.isArray(packagesQuery.data?.data?.data)
                ? // @ts-expect-error packagesQuery is not an array
                  packagesQuery.data.data.data.map((pkg) => ({
                      ...pkg,
                      name: getTranslatedField(pkg, "name", i18n.language),
                      products: Array.isArray(pkg.products)
                          ? pkg.products.map((product: PackageProduct) => ({
                                ...product,
                                name: getTranslatedField(
                                    product,
                                    "name",
                                    i18n.language
                                ),
                            }))
                          : [],
                  }))
                : [],
            // @ts-expect-error packageItemQuery is not an array
            package: packageItemQuery.data?.data?.data && {
                // @ts-expect-error packageItemQuery is not an array
                ...packageItemQuery.data.data.data,
                name: getTranslatedField(
                    // @ts-expect-error packageItemQuery is not an array
                    packageItemQuery.data.data.data,
                    "name",
                    i18n.language
                ),
            },
        }),
        [
            popularProductsQuery.data,
            popularProductsForGridQuery.data,
            productQuery.data,
            packagesQuery.data,
            packageItemQuery.data,
            i18n.language,
        ]
    );

    const invalidateAndRefetch = (queryKey: any[], refetchFn: () => void) => {
        queryClient.invalidateQueries({ queryKey });
        refetchFn();
    };

    const getPopularProductsForProductGrid = (
        paginate: number,
        page: number
    ) => {
        console.log("getPopularProductsForProductGrid called with:", {
            paginate,
            page,
        }); // Debugging
        setPopularProductsParams({ paginate, page }); // Update the state with the new parameters
    };

    useEffect(() => {
        if (
            popularProductsParams.paginate !== 0 ||
            popularProductsParams.page !== 0
        ) {
            console.log(
                "Refetching popular products with:",
                popularProductsParams
            ); // Debugging
            popularProductsForGridQuery.refetch();
        }
    }, [popularProductsParams]);

    const getPackageById = (id: string) => {
        setPackageId(id);
    };

    return {
        isLoadingPopularProducts: popularProductsQuery.isLoading,
        isLoadingPopularProductsForGrid: popularProductsForGridQuery.isLoading,
        isLoadingPackageItem: packageItemQuery.isLoading,
        isLoadingProduct: productQuery.isLoading,
        isLoadingPackages: packagesQuery.isLoading,
        popularProductsError: popularProductsQuery.error,
        popularProductsForGridError: popularProductsForGridQuery.error,
        packageItemError: packageItemQuery.error,
        packagesError: packagesQuery.error,
        productError: productQuery.error,
        ...transformedData,
        getPopularProducts: (paginate: number, page: number) =>
            invalidateAndRefetch(
                createQueryKey("popularProducts", paginate, page),
                popularProductsQuery.refetch
            ),
        getPopularProductsForProductGrid,
        getProductById: (id: string) =>
            invalidateAndRefetch(
                createQueryKey("product", id),
                productQuery.refetch
            ),
        getPackages: () =>
            invalidateAndRefetch(
                createQueryKey("packages"),
                packagesQuery.refetch
            ),
        getPackageById,
    };
};
