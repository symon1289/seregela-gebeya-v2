import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Meta from "../components/Meta";
import Breadcrumb from "../components/Breadcrumb";
import { getProductMetaTags } from "../config/meta";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/features/cartSlice";
import { toggleWishlistItem } from "../store/features/wishlistSlice";
import { addRecentProduct } from "../store/features/productSlice";
import { ShoppingCart, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { RootState } from "../store/store";
import defaultImage from "../assets/no-image-available-02.jpg";
import { Product } from "../types/product";
import "./ProductDetail.css";
import { useTranslation } from "react-i18next";
import PriceFormatter from "../components/PriceFormatter";
import ProductGrid from "../components/product grid/ProductGrid";
import ProductDetailLoad from "../components/loading skeletons/product/Detail.tsx";
const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );
    const isInWishlist = wishlistItems.some(
        (item) => Number(item.id) === Number(id)
    );
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<{
        id: number;
        name: string;
    } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMousePosition, setModalMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const [isModalImageZoomed, setIsModalImageZoomed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const initialItemsToLoad = 12;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // Fetch related products
    const fetchRelatedProducts = useCallback(
        async (
            subcategoryId: number,
            page: number,
            append: boolean = false
        ) => {
            try {
                setLoadingRelated(true);
                setRelatedError(null);

                const response = await fetch(
                    import.meta.env.VITE_API_BASE_URL +
                        `/subcategories/${subcategoryId}/products?page=${page}&paginate=${initialItemsToLoad}`
                );

                if (!response.ok) {
                    throw new Error(
                        t("error_fetch_related_products") +
                            t("status") +
                            `${response.status}`
                    );
                }

                const data = await response.json();

                // Filter out the current product from related products
                const filteredProducts = data.data.filter(
                    (p: Product) => p.id.toString() !== id
                );

                // Check if there are more products available
                setHasMoreProducts(
                    data.meta?.current_page < data.meta?.last_page
                );

                if (append) {
                    setRelatedProducts((prev) => [
                        ...prev,
                        ...filteredProducts,
                    ]);
                } else {
                    setRelatedProducts(filteredProducts);
                }
            } catch (err) {
                setRelatedError(
                    err instanceof Error
                        ? err.message
                        : t("error_fetch_related_products")
                );
            } finally {
                setLoadingRelated(false);
            }
        },
        [id, initialItemsToLoad, t]
    );

    const handleLoadMore = () => {
        if (product?.subcategory?.id && !loadingRelated) {
            setCurrentPage((prev) => prev + 1);
            fetchRelatedProducts(product.subcategory.id, currentPage + 1, true);
        }
    };

    const handleQuantityChange = (value: string) => {
        if (!product) return;

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            if (numValue > product.left_in_stock) {
                setQuantity(product.left_in_stock);
            } else if (numValue < 1) {
                setQuantity(1);
            } else {
                setQuantity(numValue);
            }
        }
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovering(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMobile) {
            const { left, top, width, height } =
                e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setMousePosition({ x, y });
        }
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(
                addToCart({
                    id: Number(product.id),
                    name: product.name,
                    price: String(product.price),
                    quantity,
                    image_paths: product.image_paths || [],
                    left_in_stock: product.left_in_stock,
                })
            );
        }
    };

    const handlePrevImage = useCallback(() => {
        if (product?.image_paths) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === 0 ? product.image_paths.length - 1 : prevIndex - 1
            );
            setIsModalImageZoomed(false);
        }
    }, [product?.image_paths]);

    const handleNextImage = useCallback(() => {
        if (product?.image_paths) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === product.image_paths.length - 1 ? 0 : prevIndex + 1
            );
            setIsModalImageZoomed(false);
        }
    }, [product?.image_paths]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isModalOpen) return;

            if (e.key === "ArrowLeft") {
                handlePrevImage();
            } else if (e.key === "ArrowRight") {
                handleNextImage();
            } else if (e.key === "Escape") {
                setIsModalOpen(false);
            }
        },
        [isModalOpen, handlePrevImage, handleNextImage]
    );

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    import.meta.env.VITE_API_BASE_URL + `/products/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch product. Status: ${response.status}`
                    );
                }

                const result = await response.json();

                if (isMounted) {
                    setProduct(result.data);
                    // Add to recently viewed products
                    dispatch(
                        addRecentProduct({
                            id: result.data.id,
                            name: result.data.name,
                            name_am: result.data.name_am,
                            description: result.data.description,
                            description_am: result.data.description_am,
                            supplier: result.data.supplier,
                            brand: result.data.brand,
                            measurement_type: result.data.measurement_type,
                            price: parseFloat(result.data.price).toString(),
                            discount: result.data.discount,
                            category_id: result.data.category_id,
                            category: result.data.category,
                            subcategory: result.data.subcategory,
                            subcategory_id: result.data.subcategory_id,
                            stores: result.data.stores,
                            total_quantity: result.data.total_quantity,
                            left_in_stock: result.data.left_in_stock,
                            image_paths: result.data.image_paths,
                            created_at: result.data.created_at,
                            updated_at: result.data.updated_at,
                            rating: result.data.rating,
                            is_non_stocked: result.data.is_non_stocked,
                            is_active: result.data.is_active,
                            unit: result.data.unit,
                            originalPrice: result.data.originalPrice,
                            image: result.data.image_paths?.[0] || defaultImage,
                        })
                    );
                    // Fetch related products if subcategory exists
                    if (result.data.subcategory?.id) {
                        setCurrentPage(1);
                        fetchRelatedProducts(result.data.subcategory.id, 1);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to fetch product"
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchProduct();
        }

        return () => {
            isMounted = false;
        };
    }, [id, dispatch, fetchRelatedProducts]);

    useEffect(() => {
        const fetchCategory = async (categoryId: number) => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_API_BASE_URL +
                        `/categories/${categoryId}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch category`);
                }
                const result = await response.json();
                setCategory(result.data);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };

        if (product?.subcategory?.category_id) {
            fetchCategory(product.subcategory.category_id);
        }
    }, [product?.subcategory?.category_id]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen, handleKeyDown]);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (product?.subcategory?.id) {
            fetchRelatedProducts(product.subcategory.id, currentPage);
        }
    }, [product?.subcategory?.id, currentPage, dispatch, fetchRelatedProducts]);

    if (loading) {
        return (
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                <ProductDetailLoad />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">Error</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-gray-600">{t("no_products")}</p>
            </div>
        );
    }

    function PriceDisplay({ price }: { price: number }) {
        const formattedPrice = price.toFixed(2);
        const [integerPart, decimalPart] = formattedPrice.split(".");

        return (
            <div className="flex items-center">
                <span className="product-detail-integer-part items-center">
                    {parseInt(integerPart).toLocaleString("en-US")}
                </span>
                <div className="flex flex-col text-xs text-gray-500">
                    <span className="product-detail-decimal-part">
                        .{decimalPart}
                    </span>
                    <span className="product-detail-birr-part">
                        {t("birr")}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            {product && <Meta config={getProductMetaTags(product)} />}
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                {product && (
                    <div className="mb-0">
                        <Breadcrumb
                            paths={[
                                { name: "Products", url: "/seregela-gebeya-v2/products" },
                                ...(category
                                    ? [
                                          {
                                              name: category.name,
                                              url: `/seregela-gebeya-v2/category/${category.id}`,
                                          },
                                      ]
                                    : []),
                                ...(product.subcategory
                                    ? [
                                          {
                                              name: product.subcategory.name,
                                              url: `/seregela-gebeya-v2/subcategory/${product.subcategory.id}`,
                                          },
                                      ]
                                    : []),
                                { name: product.name, url: "" },
                            ]}
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Product Image Gallery */}
                    <div className="bg-white rounded-lg py-4 shadow-sm  space-y-4">
                        <div className="relative aspect-square">
                            <div
                                className="w-full h-full border rounded-lg overflow-hidden"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            >
                                <img
                                    src={
                                        product.image_paths?.[
                                            selectedImageIndex
                                        ] || defaultImage
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-contain rounded-lg cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </div>
                            {isHovering && (
                                <div
                                    className="absolute z-50 top-0 left-[calc(100%+1.5rem)] w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border"
                                    style={{
                                        backgroundImage: `url(${product.image_paths?.[selectedImageIndex]})`,
                                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                        backgroundSize: "250%",
                                        backgroundRepeat: "no-repeat",
                                        backgroundOrigin: "content-box",
                                        padding: "1rem",
                                    }}
                                />
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.image_paths?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.image_paths?.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedImageIndex(index)
                                        }
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all ${
                                            selectedImageIndex === index
                                                ? "border-primary"
                                                : "border-transparent hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - Thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-lg py-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>
                            <button
                                onClick={() => {
                                    dispatch(
                                        toggleWishlistItem({
                                            id: Number(product.id),
                                            name: product.name,
                                            price: String(product.price),
                                            image_paths:
                                                product.image_paths || [],
                                            left_in_stock:
                                                product.left_in_stock,
                                            quantity: 1,
                                        })
                                    );
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Heart
                                    size={24}
                                    className={
                                        isInWishlist
                                            ? "fill-primary text-primary"
                                            : "text-gray-400"
                                    }
                                />
                            </button>
                        </div>
                        {product.name_am && (
                            <h2 className="text-xl text-gray-600 mb-4">
                                {product.name_am}
                            </h2>
                        )}

                        <div className="flex items-baseline gap-4 mb-6">
                            <PriceDisplay price={parseFloat(product.price)} />
                            {parseFloat(product.discount) > 0 && (
                                <>
                                    <span className="text-lg text-gray-500 line-through">
                                        {(
                                            parseFloat(product.price) *
                                            (1 +
                                                parseFloat(product.discount) /
                                                    100)
                                        ).toFixed(2)}{" "}
                                        Birr
                                    </span>
                                    <span className="text-sm text-red-500 font-medium">
                                        {product.discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {product.description && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">
                                    Description
                                </h2>
                                <div className="relative">
                                    <p
                                        className={`text-gray-600 whitespace-pre-line break-normal ${
                                            !isDescriptionExpanded &&
                                            "max-h-24 overflow-hidden"
                                        }`}
                                        style={{
                                            maskImage: !isDescriptionExpanded
                                                ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                                                : "none",
                                            WebkitMaskImage:
                                                !isDescriptionExpanded
                                                    ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                                                    : "none",
                                        }}
                                    >
                                        {product.description}
                                    </p>
                                    {product.description.length > 100 && (
                                        <button
                                            onClick={() =>
                                                setIsDescriptionExpanded(
                                                    !isDescriptionExpanded
                                                )
                                            }
                                            className="mt-2 text-primary hover:text-[#c88d31] font-medium"
                                        >
                                            {isDescriptionExpanded
                                                ? "Show less"
                                                : "Show more"}
                                        </button>
                                    )}
                                </div>
                                {product.description_am && (
                                    <p className="text-gray-600 mt-2">
                                        {product.description_am}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mb-6">
                            {product.subcategory && (
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-gray-600">
                                        {t("category")}:
                                    </span>
                                    <span className="font-medium">
                                        {product.subcategory.name}
                                    </span>
                                    {product.subcategory.name_am && (
                                        <span className="text-gray-500">
                                            ({product.subcategory.name_am})
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-gray-600">
                                    {t("unit")}:
                                </span>
                                <span className="font-medium">
                                    {product.measurement_type}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-gray-600">
                                    {t("brand")}:
                                </span>
                                <span className="font-medium">
                                    {product.brand}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600">
                                    {t("stock")}:
                                </span>
                                <span className="font-medium">
                                    {/* Stock Warning */}
                                    {product.left_in_stock > 0 &&
                                        product.left_in_stock <= 10 && (
                                            <div className="text-red-500 text-sm animate-pulse">
                                                {t("only")}{" "}
                                                {product.left_in_stock}{" "}
                                                {t("left")}
                                            </div>
                                        )}
                                    {product.left_in_stock > 10 && (
                                        <div>{t("in_stock")}</div>
                                    )}
                                    {product.left_in_stock === 0 && (
                                        <div>{t("not_available_in_stock")}</div>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        {product && (
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-gray-600">
                                    {t("quantity")}:
                                </span>
                                <div className="relative">
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    e.target.value
                                                )
                                            }
                                            min="1"
                                            max={product.left_in_stock}
                                            className="border rounded-l-lg px-3 py-2 focus:outline-none focus:border-primary w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen
                                                )
                                            }
                                            className="border border-l-0 rounded-r-lg px-3 py-3 hover:bg-gray-50 focus:outline-none focus:border-primary"
                                        >
                                            <svg
                                                className="w-4 h-4 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {Array.from(
                                                {
                                                    length: product.left_in_stock,
                                                },
                                                (_, i) => i + 1
                                            ).map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => {
                                                        handleQuantityChange(
                                                            num.toString()
                                                        );
                                                        setIsDropdownOpen(
                                                            false
                                                        );
                                                    }}
                                                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                                                        quantity === num
                                                            ? "bg-gray-100"
                                                            : ""
                                                    }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="button_cart w-full bg-primary hover:bg-secondary text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={product.left_in_stock === 0}
                        >
                            <div className="default-btn">
                                <ShoppingCart size={30} />
                                {product.left_in_stock === 0
                                    ? t("out_of_stock")
                                    : t("add_to_cart")}
                            </div>
                            <div className="hover-btn">
                                <span className="mr-2">
                                    <PriceFormatter price={product.price} />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
                {/* Related Products Section */}
                {product.subcategory && (
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                More from this Category
                            </h2>
                            {hasMoreProducts && (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingRelated}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loadingRelated ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            {t("loading")}
                                        </>
                                    ) : (
                                        <>{t("loadMore")}</>
                                    )}
                                </button>
                            )}
                        </div>
                        {loadingRelated && currentPage === 1 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : relatedError ? (
                            <div className="text-center text-red-600 py-8">
                                {relatedError}
                            </div>
                        ) : relatedProducts.length > 0 ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {relatedProducts.map((relatedProduct) => (
                                        <ProductCard
                                            key={relatedProduct.id}
                                            id={Number(relatedProduct.id)}
                                            name={relatedProduct.name}
                                            price={String(relatedProduct.price)}
                                            image={
                                                relatedProduct
                                                    .image_paths?.[0] ||
                                                defaultImage
                                            }
                                            originalPrice={String(
                                                relatedProduct.price
                                            )}
                                            left_in_stock={
                                                relatedProduct.left_in_stock
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 py-8">
                                {t("no_related_products")}
                            </p>
                        )}
                    </div>
                )}
                <section className="mb-12 mt-6">
                    <ProductGrid />
                </section>

                {/* Image Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 z-[999] flex items-center justify-center p-4">
                        <div className="relative max-w-5xl w-full h-[80vh] bg-white rounded-lg p-4 flex flex-col">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors z-10"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="relative flex-1 min-h-0 flex flex-col md:flex-row gap-4">
                                <div
                                    className={`${
                                        isMobile
                                            ? "order-2 w-full h-20 flex-shrink-0"
                                            : "order-1 w-24 h-full"
                                    }`}
                                >
                                    {/* Thumbnail Gallery */}
                                    {product.image_paths?.length > 1 && (
                                        <div
                                            className={`h-full py-2 flex ${
                                                isMobile
                                                    ? "flex-row overflow-x-auto"
                                                    : "flex-col overflow-y-auto"
                                            } gap-2`}
                                        >
                                            {product.image_paths?.map(
                                                (image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedImageIndex(
                                                                index
                                                            );
                                                            setIsModalImageZoomed(
                                                                false
                                                            );
                                                        }}
                                                        className={`${
                                                            isMobile
                                                                ? "h-full aspect-square"
                                                                : "w-full aspect-square"
                                                        } flex-shrink-0 rounded-lg border-2 transition-all ${
                                                            selectedImageIndex ===
                                                            index
                                                                ? "border-primary"
                                                                : "border-transparent hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${product.name} - Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-contain rounded-lg"
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="relative order-1 md:order-2 flex-1 h-full flex items-center justify-center">
                                    <div
                                        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${
                                            isModalImageZoomed
                                                ? "cursor-zoom-out"
                                                : "cursor-zoom-in"
                                        }`}
                                        onClick={() =>
                                            setIsModalImageZoomed(
                                                !isModalImageZoomed
                                            )
                                        }
                                        onMouseMove={(e) => {
                                            if (!isModalImageZoomed) return;
                                            const { left, top, width, height } =
                                                e.currentTarget.getBoundingClientRect();
                                            const x =
                                                ((e.clientX - left) / width) *
                                                100;
                                            const y =
                                                ((e.clientY - top) / height) *
                                                100;
                                            setModalMousePosition({ x, y });
                                        }}
                                    >
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={
                                                    product.image_paths?.[
                                                        selectedImageIndex
                                                    ]
                                                }
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain"
                                                style={{
                                                    transform:
                                                        isModalImageZoomed
                                                            ? "scale(2)"
                                                            : "scale(1)",
                                                    transformOrigin: `${modalMousePosition.x}% ${modalMousePosition.y}%`,
                                                    transition:
                                                        "transform 0.2s ease-out",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={handlePrevImage}
                                        disabled={
                                            product.image_paths?.length === 1
                                        }
                                        className="absolute left-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={handleNextImage}
                                        disabled={
                                            product.image_paths?.length === 1
                                        }
                                        className="absolute right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 transition-colors disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
