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
            className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-300 p-3 max-w-xs md:max-w-full mx-auto my-auto border border-gray-100 bg-white"
            onClick={handleCardClick}
        >
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                    src={displayImage}
                    alt={name}
                    className="rounded-xl hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3 justify-between">
                <h3 className="font-black text-gray-900 md:text-3xl text-xl">
                    {name}
                </h3>
                {description && (
                    <>
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
                    </>
                )}
                <div className="flex justify-between item-center">
                    <div className="flex items-center">
                        <p className="text-gray-600 font-bold text-sm ml-1">
                            {left_in_stock > 0 && left_in_stock <= 10 && (
                                <div className="text-red-500 text-sm animate-pulse line-clamp-2 sm:line-clamp-none">
                                    {t("only")} {left_in_stock} {t("left")}
                                </div>
                            )}
                            {left_in_stock > 10 && <div>{t("in_stock")}</div>}
                            {left_in_stock === 0 && (
                                <div>{t("not_available_in_stock")}</div>
                            )}
                        </p>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-500 line-through text-sm">
                                {parseFloat(originalPrice).toFixed(0)}{" "}
                                {t("birr")}
                            </span>
                            <span className="text-[#ea5254] text-sm">
                                {discount}% {t("OFF")}
                            </span>
                        </div>
                    )}
                    {max_quantity_per_order !== null && (
                        <div className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-800 hidden md:block">
                            <p className="text-base font-medium text-gray-600 lowercase line-clamp-2 sm:line-clamp-none">
                                {t("max_quantity")}: {max_quantity_per_order}
                            </p>
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <p className="text-xl font-black text-gray-800">
                        <PriceDisplay price={price} />
                    </p>
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-900">
                        <button
                            className="px-6 py-2 transition ease-in duration-200 uppercase rounded-full hover:bg-primary hover:text-white border-2 border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleAddToCart}
                            disabled={left_in_stock === 0}
                        >
                            {left_in_stock === 0
                                ? t("out_of_stock")
                                : t("add_to_cart")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardList;
