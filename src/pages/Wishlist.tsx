import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import {
    removeFromWishlist,
    clearWishlist,
} from "../store/features/wishlistSlice";
import { addToCart } from "../store/features/cartSlice";
import { Trash2, ShoppingCart, ShoppingBag } from "lucide-react";
import Meta from "../components/Meta";
import { getWishlistMetaTags } from "../config/meta";
import { Product } from "../types/product";
import { useTranslation } from "react-i18next";

interface WishlistItem
    extends Pick<
        Product,
        "id" | "name" | "price" | "image_paths" | "left_in_stock"
    > {
    quantity: number;
}

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return numPrice.toFixed(2);
    };

    const handleRemoveFromWishlist = (id: number) => {
        dispatch(removeFromWishlist(id));
    };

    const handleClearWishlist = () => {
        dispatch(clearWishlist());
    };

    const handleAddToCart = (item: WishlistItem) => {
        dispatch(addToCart({ ...item, quantity: 1 }));
        dispatch(removeFromWishlist(item.id));
    };

    const handleBuyAll = () => {
        if (wishlistItems.length > 0) {
            wishlistItems.forEach((item) => {
                dispatch(addToCart({ ...item, quantity: 1 }));
            });
            dispatch(clearWishlist());
            navigate("/cart");
        }
    };

    if (wishlistItems.length === 0) {
        return (
            <>
                {" "}
                <Meta config={getWishlistMetaTags()} />
                <div className="max-w-screen-xl mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("no_items_in_wish_list")}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {t("add_item_to_empty_wishlist")}
                        </p>
                        <Link
                            to="/products"
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
            <Meta config={getWishlistMetaTags()} />
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{t("wish_list")}</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleBuyAll}
                            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ShoppingBag size={20} />
                            {t("buy_all")}
                        </button>
                        <button
                            onClick={handleClearWishlist}
                            className="text-red-500 hover:text-red-600 flex items-center gap-2"
                        >
                            <Trash2 size={20} />
                            {t("clear_wishlist")}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm p-4"
                        >
                            <div className="relative aspect-square mb-4">
                                <img
                                    src={item.image_paths?.[0]}
                                    alt={item.name}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Link
                                    to={`/products/${item.id}`}
                                    className="block"
                                >
                                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                        {item.name}
                                    </h3>
                                </Link>
                                <p className="text-xl font-bold">
                                    {formatPrice(item.price)} {t("birr")}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="flex-1 bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ShoppingCart size={20} />
                                        {t("add_to_cart")}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRemoveFromWishlist(item.id)
                                        }
                                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Wishlist;
