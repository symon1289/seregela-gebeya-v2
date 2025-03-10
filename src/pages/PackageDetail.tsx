import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackageToCart } from "../store/features/cartSlice";
import { toggleWishlistItem } from "../store/features/wishlistSlice";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { RootState } from "../store/store";
import defaultImage from "../assets/no-image-available-02.jpg";
import "./ProductDetail.css";
import { useTranslation } from "react-i18next";
import { usePackages } from "../hooks/usePackages";
import { Link, useParams } from "react-router-dom";
import PriceFormatter from "../components/PriceFormatter";
import DetailCard from "../components/loading skeletons/package/DetailCard";
import Breadcrumb from "../components/Breadcrumb";
import { useTag } from "../hooks/useTags";
import { getLeftInStock } from "../utils/helper";
import ProductGrid from "../components/product grid/ProductGrid";
import PackageCardForGrid from "../components/packagesComponents/PackageCardForGrid";
import Meta from "../components/Meta";
import { getPackageMetaTags } from "../config/meta";
const PackageDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const previousCountRef = useRef(0);
    const { user } = useSelector((state: RootState) => state.auth);

    const {
        isLoadingPackageItem,
        packageItemError,
        package: packageItem,
        getPackageById,
    } = usePackages();
    const { usePackagesByTag } = useTag();
    const { filteredPackages, isLoading, error, hasMore, loadMore } =
        usePackagesByTag({
            tagId: Number(packageItem?.tag_id),
            searchName: "",
        });
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );
    const isInWishlist = wishlistItems.some(
        (item) => Number(item.id) === Number(id)
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMousePosition, setModalMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const [isModalImageZoomed, setIsModalImageZoomed] = useState(false);
    const [tag, setTag] = useState<{
        id: number;
        name: string;
    } | null>(null);
    useEffect(() => {
        if (id) {
            getPackageById(id);
        }
    }, [id]);
    useEffect(() => {
        const fetchTag = async (tagId: number) => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_API_BASE_URL + `/tags/${tagId}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch tag`);
                }
                const result = await response.json();
                setTag(result.data);
            } catch (error) {
                console.error("Error fetching tag:", error);
            }
        };

        if (packageItem?.tag_id) {
            fetchTag(packageItem.tag_id);
        }
    }, [packageItem?.tag_id]);
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

    const handleQuantityChange = (value: string) => {
        if (!packageItem) return;

        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            if (numValue > packageItem.left_in_stock) {
                setQuantity(packageItem.left_in_stock);
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
        if (packageItem) {
            dispatch(
                addPackageToCart({
                    id: Number(packageItem.id),
                    name: packageItem.name,
                    price: String(packageItem.price),
                    quantity,
                    image_path: packageItem.image_path || "",
                    left_in_stock: getLeftInStock(user, packageItem) ?? 0,
                })
            );
        }
    };
    const handlePrevImage = useCallback(() => {
        if (packageItem?.image_paths) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === 0
                    ? packageItem.image_paths.length - 1
                    : prevIndex - 1
            );
            setIsModalImageZoomed(false);
        }
    }, [packageItem?.image_paths]);

    const handleNextImage = useCallback(() => {
        if (packageItem?.image_paths) {
            setSelectedImageIndex((prevIndex) =>
                prevIndex === packageItem.image_paths.length - 1
                    ? 0
                    : prevIndex + 1
            );
            setIsModalImageZoomed(false);
        }
    }, [packageItem?.image_paths]);

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
        if (
            filteredPackages.length > previousCountRef.current &&
            previousCountRef.current !== 0
        ) {
            const previousCount = previousCountRef.current;
            previousCountRef.current = filteredPackages.length;

            requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    const firstNewProduct = container.children[
                        previousCount
                    ] as HTMLElement;
                    if (firstNewProduct) {
                        firstNewProduct.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "start",
                        });
                    }
                }
            });
        } else {
            previousCountRef.current = filteredPackages.length; // Set count without scrolling on first load
        }
    }, [filteredPackages]);
    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
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
        checkScrollability();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollability);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", checkScrollability);
            }
        };
    }, [filteredPackages]);
    if (isLoadingPackageItem) {
        return <DetailCard />;
    }

    if (packageItemError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{t("error")}</p>
                    <p className="text-gray-600">{packageItemError.message}</p>
                </div>
            </div>
        );
    }

    if (!packageItem) {
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
            {packageItem && <Meta config={getPackageMetaTags(packageItem)} />}
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                {packageItem && (
                    <div className="mb-0">
                        <Breadcrumb
                            paths={[
                                {
                                    name: "Packages",
                                    url: "/packages",
                                },
                                ...(tag
                                    ? [
                                          {
                                              name: tag.name,
                                              url: `/tags/${tag.id}/packages`,
                                          },
                                      ]
                                    : []),
                                { name: packageItem.name, url: "" },
                            ]}
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
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
                                        packageItem.image_paths?.[
                                            selectedImageIndex
                                        ] || defaultImage
                                    }
                                    alt={packageItem.name}
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full h-full object-contain rounded-lg cursor-pointer"
                                />
                            </div>
                            {isHovering && (
                                <div
                                    className="absolute z-50 top-0 left-[calc(100%+1.5rem)] w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border"
                                    style={{
                                        backgroundImage: `url(${packageItem.image_paths?.[selectedImageIndex]})`,
                                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                        backgroundSize: "200%",
                                        backgroundRepeat: "no-repeat",
                                        backgroundOrigin: "content-box",
                                        padding: "1rem",
                                    }}
                                />
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {packageItem.image_paths?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {packageItem.image_paths?.map(
                                    (image, index) => (
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
                                                alt={`${
                                                    packageItem.name
                                                } - Thumbnail ${index + 1}`}
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-lg py-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-bold text-gray-900">
                                {packageItem.name}
                            </h1>
                            <div>
                                <button
                                    onClick={() => {
                                        dispatch(
                                            toggleWishlistItem({
                                                id: Number(packageItem.id),
                                                name: packageItem.name,
                                                price: String(
                                                    packageItem.price
                                                ),
                                                image_paths:
                                                    packageItem.image_paths ||
                                                    [],
                                                left_in_stock:
                                                    getLeftInStock(
                                                        user,
                                                        packageItem
                                                    ) ?? 0,
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
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <PriceDisplay
                                price={parseFloat(packageItem.price)}
                            />
                            {parseFloat(packageItem.discount) > 0 && (
                                <>
                                    <span className="text-lg text-gray-500 line-through">
                                        {(
                                            parseFloat(packageItem.price) *
                                            (1 +
                                                parseFloat(
                                                    packageItem.discount
                                                ) /
                                                    100)
                                        ).toFixed(2)}{" "}
                                        {t("birr")}
                                    </span>
                                    <span className="text-sm text-red-500 font-medium">
                                        {packageItem.discount}% {t("discount")}
                                    </span>
                                </>
                            )}
                        </div>
                        {packageItem.products && (
                            <div className="mb-2">
                                <div className="mt-2 space-y-3 rounded-lg overflow-y-auto border max-h-84  bg-white px-2 py-4 sm:px-6">
                                    <div className="border-b  border-gray-200">
                                        {packageItem.products.map((item) => (
                                            <Link
                                                to={`/products/${item.id}`}
                                                key={item.id}
                                                className="flex hover:text-primary hover:cursor-pointer flex-col rounded-lg bg-white sm:flex-row"
                                            >
                                                <img
                                                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                                    src={item.image_paths[0]}
                                                    alt={item.name}
                                                />
                                                <div className="flex w-full flex-col px-4 py-4">
                                                    <span className="font-semibold line-clamp-2">
                                                        {item.name}
                                                    </span>
                                                    <span className="float-right text-gray-400">
                                                        {t("quantity")}:{" "}
                                                        {item.pivot.quantity}
                                                    </span>
                                                    <p className="text-lg font-bold">
                                                        <PriceFormatter
                                                            price={item.price}
                                                        />
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        {packageItem && (
                            <div className="flex items-center gap-4 my-2 py-4">
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
                                            max={
                                                getLeftInStock(
                                                    user,
                                                    packageItem
                                                ) ?? 0
                                            }
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
                                                    length:
                                                        getLeftInStock(
                                                            user,
                                                            packageItem
                                                        ) ?? 0,
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
                            className="button_cart w-full bg-primary hover:bg-secondary text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={packageItem.left_in_stock === 0}
                        >
                            <div className="default-btn">
                                <ShoppingCart size={30} />
                                {packageItem.left_in_stock === 0
                                    ? t("out_of_stock")
                                    : t("add_to_cart")}
                            </div>
                            <div className="hover-btn">
                                <span className="mr-2">
                                    <PriceFormatter price={packageItem.price} />
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Related Products Section */}
                {packageItem.tag_id && (
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {t("more_from_this_Category")}
                            </h2>
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={isLoading}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
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
                        {isLoading && hasMore ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 py-8">
                                {error.message}
                            </div>
                        ) : filteredPackages.length > 0 ? (
                            <div className="space-y-8 relative">
                                {canScrollLeft && (
                                    <button
                                        aria-label="Left"
                                        onClick={() => scroll("left")}
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                                    >
                                        <ChevronLeft />
                                    </button>
                                )}
                                {canScrollRight && (
                                    <button
                                        aria-label="Right"
                                        onClick={() => scroll("right")}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10"
                                    >
                                        <ChevronRight />
                                    </button>
                                )}
                                <div
                                    ref={scrollContainerRef}
                                    className="grid grid-cols-2  md:grid-cols-3   gap-6"
                                >
                                    {filteredPackages.map((relatedProduct) => (
                                        <PackageCardForGrid
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
                                                getLeftInStock(
                                                    user,
                                                    relatedProduct
                                                ) ?? 0
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
                                    {packageItem.image_paths?.length > 1 && (
                                        <div
                                            className={`h-full py-2 flex ${
                                                isMobile
                                                    ? "flex-row overflow-x-auto"
                                                    : "flex-col overflow-y-auto"
                                            } gap-2`}
                                        >
                                            {packageItem.image_paths?.map(
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
                                                            alt={`${
                                                                packageItem.name
                                                            } - Thumbnail ${
                                                                index + 1
                                                            }`}
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
                                                    packageItem.image_paths?.[
                                                        selectedImageIndex
                                                    ]
                                                }
                                                alt={packageItem.name}
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
                                            packageItem.image_paths?.length ===
                                            1
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
                                            packageItem.image_paths?.length ===
                                            1
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

export default PackageDetail;
