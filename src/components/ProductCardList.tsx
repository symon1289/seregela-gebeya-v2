import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../store/features/cartSlice";
import defaultImage from "../assets/no-image-available-02.jpg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ProductCardListProps {
    id: number;
    name: string;
    price: string;
    image?: string;
    image_paths?: string[];
    originalPrice: string;
    discount?: number;
    left_in_stock?: number;
    max_quantity_per_order?: number | null;
    unit?: string;
    brand?: string;
    description?: string | null;
}

const ProductCardList: React.FC<ProductCardListProps> = ({
    id,
    name,
    price,
    image,
    image_paths,
    originalPrice,
    discount = 0,
    left_in_stock = 0,
    max_quantity_per_order = null,
    description,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(
            addToCart({
                id,
                name,
                price,
                quantity: 1,
                image_paths: image_paths || (image ? [image] : []),
                left_in_stock,
            })
        );
        toast.success(`${name} ${t("product_added_description")}`);
    };

    const handleCardClick = () => {
        navigate(`/products/${id}`);
    };

    const displayImage = image_paths?.[0] || image || defaultImage;

    const PriceDisplay = ({ price }: { price: string }) => {
        const numericPrice = parseFloat(price).toFixed(2);
        const [integerPart, decimalPart] = numericPrice.split(".");

        return (
            <div className="flex items-center">
                <span className="product-card-integer-part">
                    {parseInt(integerPart).toLocaleString("en-US")}
                </span>
                <div className="flex flex-col text-xs text-gray-500">
                    <span>.{decimalPart}</span>
                    <span>{t("birr")}</span>
                </div>
            </div>
        );
    };

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    return (
        <div
            onClick={handleCardClick}
            className="w-full bg-white border rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-300"
        >
            {/* Product Image */}
            <div className="w-28 h-28 sm:w-44 sm:h-44 md:w-60 md:h-60 flex-shrink">
                <img
                    src={displayImage}
                    alt={name}
                    className="w-full h-full object-contain rounded-lg hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1">
                <p className="text-base font-medium line-clamp-2 sm:line-clamp-none text-black uppercase">
                    {name}
                </p>
                {description && (
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
                                WebkitMaskImage: !isDescriptionExpanded
                                    ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                                    : "none",
                            }}
                        >
                            {description}
                        </p>
                        {description.length > 100 && (
                            <button
                                onClick={() =>
                                    setIsDescriptionExpanded(
                                        !isDescriptionExpanded
                                    )
                                }
                                className="mt-2 text-primary hover:text-[#c88d31] font-medium"
                            >
                                {isDescriptionExpanded ? "" : ""}
                            </button>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">{t("stock")}:</span>
                    <span className="font-medium">
                        {/* Stock Warning */}
                        {left_in_stock > 0 && left_in_stock <= 10 && (
                            <div className="text-red-500 text-sm animate-pulse line-clamp-2 sm:line-clamp-none">
                                {t("only")} {left_in_stock} {t("left")}
                            </div>
                        )}
                        {left_in_stock > 10 && <div>{t("in_stock")}</div>}
                        {left_in_stock === 0 && (
                            <div>{t("not_available_in_stock")}</div>
                        )}
                    </span>
                </div>
                {max_quantity_per_order !== null && (
                    <p className="text-base font-medium text-gray-600 lowercase line-clamp-2 sm:line-clamp-none">
                        {t("max_quantity")}: {max_quantity_per_order}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-2 justify-between">
                    <PriceDisplay price={price} />
                    {discount > 0 && (
                        <>
                            <span className="text-gray-400 line-through text-sm">
                                {parseFloat(originalPrice).toFixed(0)}{" "}
                                {t("birr")}
                            </span>
                            <span className="text-[#f36466] text-sm">
                                {discount}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-900">
                <button
                    className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-primary hover:text-white border-2 border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleAddToCart}
                    disabled={left_in_stock === 0}
                >
                    {left_in_stock === 0 ? t("out_of_stock") : t("add_to_cart")}
                </button>
            </div>
        </div>
    );
};

export default ProductCardList;
