import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../store/features/cartSlice";
import defaultImage from "../../assets/no-image-available-02.jpg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    image?: string;
    image_paths?: string[];
    originalPrice: string;
    discount?: number;
    left_in_stock?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    image,
    image_paths,
    originalPrice,
    discount = 0,
    left_in_stock = 0,
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
        toast.success(name + " " + t("product_added_description"));
    };

    const handleCardClick = () => {
        navigate(`/packages/${id}`);
    };

    function PriceDisplay({ price }: { price: string }) {
        // Convert string price to number and format
        const numericPrice = parseFloat(price);
        const formattedPrice = numericPrice.toFixed(2);
        const [integerPart, decimalPart] = formattedPrice.split(".");

        return (
            <div className="flex items-center ">
                <span className="product-card-integer-part items-center">
                    {parseInt(integerPart).toLocaleString("en-US")}
                </span>
                <div className="flex flex-col text-xs text-gray-500">
                    <span className="product-card-decimal-part">
                        .{decimalPart}
                    </span>
                    <span className="product-card-birr-part">{t("birr")}</span>
                </div>
            </div>
        );
    }

    // Get the image to display, prioritizing image_paths over image
    const displayImage = image_paths?.[0] || image || defaultImage;

    return (
        <div
            className="w-[400px] bg-white shadow-md rounded-xl mx-auto border  mt-2    hover:scale-105  border-gray-300 transition-shadow duration-500  hover:shadow-xl"
            onClick={handleCardClick}
        >
            <img
                src={displayImage}
                alt={name}
                className="h-[400px] w-[400px] object-cover rounded-t-xl"
                loading="lazy"
            />
            <div className="px-4 py-3 w-[400px]">
                <span className="text-gray-400 mr-3 uppercase text-xs">
                    <div className="text-gray-600 font-bold text-xs ml-1">
                        {left_in_stock > 0 && left_in_stock <= 10 && (
                            <div className="text-red-500 text-xs animate-pulse line-clamp-2 sm:line-clamp-none">
                                {t("only")} {left_in_stock} {t("left")}
                            </div>
                        )}
                        {left_in_stock > 10 && <div>{t("in_stock")}</div>}
                        {left_in_stock === 0 && (
                            <div>{t("not_available_in_stock")}</div>
                        )}
                    </div>
                </span>
                <p className="text-lg font-bold text-black truncate block capitalize">
                    {name}
                </p>
                <div className="flex items-center">
                    <div className="flex items-baseline gap-2 mb-2 justify-between">
                        <p className="text-xl font-black text-gray-800">
                            <PriceDisplay price={price} />
                        </p>
                        {discount > 0 && (
                            <span className="product-card-birr-part text-gray-500 line-through">
                                {parseFloat(originalPrice).toFixed(0)}{" "}
                                {t("birr")}
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="product-card-birr-part text-[#f36466] ">
                                {discount}% {t("OFF")}
                            </span>
                        )}
                    </div>
                    <div className="ml-auto">
                        {" "}
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
        </div>
    );
};

export default ProductCard;
