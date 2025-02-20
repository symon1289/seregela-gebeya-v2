import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../store/features/cartSlice";
import { Plus } from "lucide-react";
import defaultImage from "../assets/no-image-available-02.jpg";
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
        navigate(`/products/${id}`);
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
            onClick={handleCardClick}
            className="w-full max-w-[280px] mb-4 cursor-pointer flex-shrink-0"
        >
            <div className="bg-white overflow-hidden shadow-sm rounded-[16px] border h-[280px] hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-44">
                    <img
                        src={displayImage}
                        alt={name}
                        className="w-full h-full transition-transform duration-1000 hover:scale-110 object-contain"
                        loading="lazy"
                    />
                    <div className="absolute bottom-1 right-2">
                        <button
                            aria-label="Add to Cart"
                            className="bg-blue-500 p-1.5 rounded-full text-white hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={left_in_stock === 0}
                        >
                            <Plus
                                size={20}
                                className="rotate-0 hover:rotate-180 transition-transform duration-300"
                            />
                        </button>
                    </div>
                </div>

                <div className="p-2">
                    <div className="flex items-baseline gap-2 mb-2 justify-between">
                        <PriceDisplay price={price} />
                        {discount > 0 && (
                            <span className="product-card-birr-part text-gray-500 line-through">
                                {parseFloat(originalPrice).toFixed(0)}{" "}
                                {t("birr")}
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="product-card-birr-part text-[#f36466] ">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    <div className="w-full">
                        <p className="text-black line-clamp-2 lowercase product-card-name">
                            {name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
