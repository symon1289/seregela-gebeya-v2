import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../store/features/cartSlice";
import defaultImage from "../../assets/no-image-available-02.jpg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import PriceFormatter from "../PriceFormatter";
import { PackageProduct } from "../../types/product";

interface ProductCardListProps {
    id: number;
    name: string;
    price: string;
    image_path?: string;
    image_paths?: string[];
    originalPrice: string;
    discount?: number;
    left_in_stock?: number;
    max_quantity_per_order?: number | null;
    tag_id?: number;
    products?: PackageProduct[];
}

const ProductCardList: React.FC<ProductCardListProps> = ({
    id,
    name,
    price,
    image_path,
    image_paths,
    discount = 0,
    left_in_stock = 0,
    max_quantity_per_order = null,
    products = [],
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
                image_paths: image_paths || (image_path ? [image_path] : []),
                left_in_stock,
            })
        );
        toast.success(`${name} ${t("product_added_description")}`);
    };

    const handleCardClick = () => {
        navigate(`/packages/${id}`);
    };

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

    return (
        <div
            className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl  shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300 p-3 md:max-w-full mx-auto border border-gray-300 bg-white"
            onClick={handleCardClick}
        >
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
                <img
                    src={image_path || defaultImage}
                    alt={name}
                    className="rounded-xl hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 py-3 justify-between">
                <h3 className="font-black text-gray-900 text-center md:text-left md:text-3xl text-xl">
                    {name}
                </h3>
                {products.length > 0 && (
                    <div className="mb-2">
                        <div className="mt-2 space-y-3 rounded-lg overflow-y-auto border max-h-72  bg-white px-2 py-4 sm:px-6">
                            <div className="border-b  border-gray-200">
                                {products.map((item) => (
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

                    {max_quantity_per_order !== null && (
                        <div className="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-800 hidden md:block">
                            <p className="text-base font-medium text-gray-600 lowercase line-clamp-2 sm:line-clamp-none">
                                {t("max_quantity")}: {max_quantity_per_order}
                            </p>
                        </div>
                    )}
                </div>
                <div className="space-y-4 flex-col flex md:flex-row justify-between items-center">
                    <p className="text-xl font-black text-gray-800">
                        <PriceDisplay price={price} />
                    </p>
                    {discount > 0 && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-500 line-through text-sm">
                                {(
                                    parseFloat(price) *
                                    (1 + parseFloat(String(discount)) / 100)
                                ).toFixed(2)}{" "}
                                {t("birr")}
                            </span>
                            <span className="text-[#ea5254] text-sm">
                                {discount}% {t("OFF")}
                            </span>
                        </div>
                    )}
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
