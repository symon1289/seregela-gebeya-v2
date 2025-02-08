import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectRecentProducts } from "../../store/features/productSlice";
import { addToCart } from "../../store/features/cartSlice";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import Meta from "../../components/Meta";
import { getRecentMetaTags } from "../../config/meta";
import { Product } from "../../types/product";
import { useTranslation } from "react-i18next";
import defaultImae from "../../assets/no-image-available-02.jpg";
interface recentProducts
    extends Pick<
        Product,
        "id" | "name" | "price" | "image_paths" | "left_in_stock"
    > {
    quantity: number;
}
const RecentlyViewed: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const recentProducts = useSelector(selectRecentProducts);

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return numPrice.toFixed(2);
    };

    const handleAddToCart = (item: recentProducts) => {
        dispatch(addToCart({ ...item, quantity: 1 }));
    };

    const handleBuyAll = () => {
        if (recentProducts.length > 0) {
            recentProducts.forEach((item) => {
                dispatch(addToCart({ ...item, quantity: 1 }));
            });

            navigate("/seregela-gebeya-v2/cart");
        }
    };

    if (recentProducts.length === 0) {
        return (
            <>
                {" "}
                <Meta config={getRecentMetaTags()} />
                <div className="max-w-screen-xl min-h-screen mx-auto px-4 py-8 ">
                    <div className="text-center py-16 bg-white">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("no_items_in_wish_list")}
                        </h2>
                        <Link
                            to="/seregela-gebeya-v2/products"
                            className="inline-block bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            {t("continue_shopping")}
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {" "}
            <Meta config={getRecentMetaTags()} />
            <div className="mx-automin-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">
                        {t("recently_viewed")}
                    </h1>
                    <div className="flex gap-4 ">
                        <button
                            onClick={handleBuyAll}
                            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ShoppingBag size={20} />
                            Buy All
                        </button>
                    </div>
                </div>
                <div className="w-full min-h-screen bg-white ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {recentProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-lg p-4"
                            >
                                <div className="relative aspect-square mb-4">
                                    <img
                                        src={
                                            item.image_paths?.[0] || defaultImae
                                        }
                                        alt={item.name}
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Link
                                        to={`/seregela-gebeya-v2/products/${item.id}`}
                                        className="block"
                                    >
                                        <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xl font-bold">
                                        {formatPrice(item.price)} Birr
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleAddToCart({
                                                    ...item,
                                                    quantity: 1,
                                                })
                                            }
                                            className="flex-1 bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecentlyViewed;
