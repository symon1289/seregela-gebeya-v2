import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import {
    removeFromCart,
    updateQuantity,
    updatePackageQuantity,
    removePackageFromCart,
    clearCart,
} from "../store/features/cartSlice";
import { Trash2 } from "lucide-react";
import Meta from "../components/Meta";
import { getCartMetaTags } from "../config/meta";
import PriceFormatter from "../components/PriceFormatter";
import CheckoutSteps from "../components/CheckoutSteps";
import DeliveryAddressForm from "../components/DeliveryAddressForm";

const defaultImage = "../assets/no-image-available-02.jpg";

const Cart = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // const cartItems = useSelector((state: RootState) => state.cart);
    // const packages = useSelector((state: RootState) => state.cart.packages);
    const [openDropdowns, setOpenDropdowns] = useState<{
        [key: number]: boolean;
    }>({});

    // const { subtotal, shipping, grandTotal, freeShipping } =
    //     calculateCartTotals(cartItems.items, packages);

    const handleRemoveFromCart = (id: number) => {
        dispatch(removeFromCart(id));
    };
    const handleRemovePackageFromCart = (id: number) => {
        dispatch(removePackageFromCart(id));
    };
    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity === 0) {
            dispatch(removeFromCart(id));
        } else {
            dispatch(updateQuantity({ id, quantity }));
        }
    };
    const handlePackageQuantityChange = (id: number, quantity: number) => {
        if (quantity === 0) {
            dispatch(removePackageFromCart(id));
        } else {
            dispatch(updatePackageQuantity({ id, quantity }));
        }
    };
    const toggleDropdown = (id: number) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const cartItems = useSelector((state: RootState) => state.cart);

    if (cartItems.items.length === 0 && cartItems.packages.length === 0) {
        return (
            <>
                {" "}
                <Meta config={getCartMetaTags()} />
                <div className="max-w-screen-xl mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("no_items_in_cart")}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {t("no_items_in_cart_description")}
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
            <Meta config={getCartMetaTags()} />

            <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-3 ">
                <CheckoutSteps step1 />
                <div className="grid lg:grid-cols-2 ">
                    <div className="px-4 pt-8">
                        <div className="justify-between">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold">
                                    {t("cart")}
                                </h1>
                                <button
                                    onClick={handleClearCart}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors p-2"
                                >
                                    <Trash2 size={20} />
                                    {t("clear_cart")}
                                </button>
                            </div>
                        </div>
                        <div className="border-b  border-gray-200">
                            {cartItems.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="items-center border-b  border-gray-200 mb-2 bg-white rounded-lg shadow-sm py-4 flex gap-4  hover:cursor-pointer hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={
                                                item.image_paths?.[0] ||
                                                defaultImage
                                            }
                                            alt={item.name}
                                            className="m-2 h-24 w-24 rounded-md border object-cover object-center"
                                        />
                                    </div>
                                    <div className="flex-grow hover:text-primary">
                                        <Link
                                            to={`/products/${item.id}`}
                                            className="block"
                                        >
                                            <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xl font-bold mt-2">
                                            <PriceFormatter
                                                price={item.price.toString()}
                                            />
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(
                                                            e.target.value
                                                        );
                                                        if (!isNaN(value)) {
                                                            if (
                                                                value >
                                                                item.left_in_stock
                                                            ) {
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    item.left_in_stock
                                                                );
                                                            } else if (
                                                                value < 1
                                                            ) {
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    1
                                                                );
                                                            } else {
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    value
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    min="1"
                                                    max={item.left_in_stock}
                                                    className="border rounded-l-lg px-3 py-2 focus:outline-none focus:border-primary w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(item.id)
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
                                            {openDropdowns[item.id] && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                    {Array.from(
                                                        {
                                                            length: item.left_in_stock,
                                                        },
                                                        (_, i) => i + 1
                                                    ).map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => {
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    num
                                                                );
                                                                toggleDropdown(
                                                                    item.id
                                                                );
                                                            }}
                                                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                                                                item.quantity ===
                                                                num
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
                                        <button
                                            onClick={() =>
                                                handleRemoveFromCart(item.id)
                                            }
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {cartItems.packages.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-sm p-4 flex gap-4  hover:cursor-pointer hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.image_path || defaultImage}
                                        alt={item.name}
                                        className="m-2 h-24 w-24 rounded-md border object-cover object-center"
                                    />
                                </div>
                                <div className="flex-grow hover:text-primary">
                                    <Link
                                        to={`/products/${item.id}`}
                                        className="block"
                                    >
                                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-xl font-bold mt-2">
                                        <PriceFormatter
                                            price={item.price.toString()}
                                        />
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(
                                                        e.target.value
                                                    );
                                                    if (!isNaN(value)) {
                                                        if (
                                                            value >
                                                            item.left_in_stock
                                                        ) {
                                                            handlePackageQuantityChange(
                                                                item.id,
                                                                item.left_in_stock
                                                            );
                                                        } else if (value < 1) {
                                                            handlePackageQuantityChange(
                                                                item.id,
                                                                1
                                                            );
                                                        } else {
                                                            handlePackageQuantityChange(
                                                                item.id,
                                                                value
                                                            );
                                                        }
                                                    }
                                                }}
                                                min="1"
                                                max={item.left_in_stock}
                                                className="border rounded-l-lg px-3 py-2 focus:outline-none focus:border-primary w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() =>
                                                    toggleDropdown(item.id)
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
                                        {openDropdowns[item.id] && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {Array.from(
                                                    {
                                                        length: item.left_in_stock,
                                                    },
                                                    (_, i) => i + 1
                                                ).map((num) => (
                                                    <button
                                                        key={num}
                                                        onClick={() => {
                                                            handlePackageQuantityChange(
                                                                item.id,
                                                                num
                                                            );
                                                            toggleDropdown(
                                                                item.id
                                                            );
                                                        }}
                                                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                                                            item.quantity ===
                                                            num
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
                                    <button
                                        onClick={() =>
                                            handleRemovePackageFromCart(item.id)
                                        }
                                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DeliveryAddressForm />
                </div>
            </div>
        </>
    );
};

export default Cart;
