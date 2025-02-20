import React, { useEffect, useState } from "react";
import { SectionProps } from "../../types/extras";
import { Product } from "../../types/product";
import { addToCart } from "../../store/features/cartSlice";
import { useDispatch } from "react-redux";
import defaultImage from "../../assets/no-image-available-02.jpg";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ForProductSection from "../loading skeletons/product/ForProductSection";
import PriceFormatter from "../PriceFormatter";

const ProductSection: React.FC<SectionProps> = ({
    title,
    products = [],
    intervalTime = 5000,
    loading,
}) => {
    const dispatch = useDispatch();
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        if (loading || products.length === 0) return;

        const interval = setInterval(() => {
            setStartIndex((prevIndex) => (prevIndex + 6) % products.length);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [loading, products, intervalTime]);

    const visibleProducts = products.slice(startIndex, startIndex + 6);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex + 6) % products.length);
    };

    const handlePrev = () => {
        setStartIndex(
            (prevIndex) => (prevIndex - 6 + products.length) % products.length
        );
    };

    const handleAddToCart =
        (
            product: Pick<
                Product,
                | "id"
                | "name"
                | "left_in_stock"
                | "price"
                | "image_paths"
                | "originalPrice"
                | "image"
                | "discount"
                | "max_quantity_per_order"
            >
        ) =>
        (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(
                addToCart({
                    id: Number(product.id),
                    name: product.name,
                    price: String(product.price),
                    quantity: 1,
                    image_paths:
                        product.image_paths ||
                        (product.image ? [product.image] : []),
                    left_in_stock: product.left_in_stock,
                })
            );
        };

    if (loading || products.length === 0) {
        return <ForProductSection />;
    }

    return (
        <div className="w-full px-4 mb-6">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">{title}</h2>
                <div className="flex items-center space-x-2">
                    <button
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={handlePrev}
                        aria-label="Previous Products"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={handleNext}
                        aria-label="Next Products"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            <ul>
                {visibleProducts.map((product) => (
                    <li
                        key={product.id}
                        className="justify-between items-center flex space-x-4 py-2 border-b hover:text-[#e7a334] transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
                    >
                        <Link
                            to={`/products/${product.id}`}
                            className="flex items-center gap-4"
                        >
                            <img
                                src={product.image || defaultImage}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium line-clamp-1">
                                    {product.name}
                                </span>
                                <div>
                                    {parseInt(product.discount) > 0 && (
                                        <span className="text-xs line-through text-gray-500 mr-2">
                                            <PriceFormatter
                                                price={product.originalPrice}
                                            />
                                        </span>
                                    )}
                                    <span className="text-sm font-bold text-red-500">
                                        <PriceFormatter price={product.price} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <button
                            className="bg-blue-500 p-1 rounded-full text-white hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleAddToCart(product)}
                            aria-label="Add to cart"
                            title="Add to cart"
                            disabled={product.left_in_stock === 0}
                        >
                            <Plus
                                size={16}
                                className="rotate-0 hover:rotate-180 transition-transform duration-300"
                            />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductSection;
