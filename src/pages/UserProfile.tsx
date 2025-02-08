import React, { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaWallet,
    FaEdit,
    FaSave,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useOrder } from "../hooks/useOrder";
import { OrderDetails } from "../types/order";
import { UserData } from "../types/user";
import { useTranslation } from "react-i18next";
import useUser from "../hooks/useUser";
import Loader from "../components/Loader";
import PriceFormatter from "../components/PriceFormatter";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { logout } from "../store/features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Reusable Profile Field Component
const ProfileField = ({
    icon,
    value,
    name,
    isEditing,
    onChange,
    type = "text",
    placeholder,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    name: string;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
}) => (
    <div className="flex items-center space-x-4">
        {icon}
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                placeholder={placeholder}
            />
        ) : (
            <p>{value}</p>
        )}
    </div>
);

// Reusable Address Fields Component
const AddressFields = ({
    user,
    isEditing,
    onChange,
}: {
    user: UserData | null;
    isEditing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <div className="flex items-center space-x-4">
        <FaMapMarkerAlt className="text-gray-500" />
        {isEditing ? (
            <div className="grid grid-cols-2 gap-2 w-full">
                <input
                    type="text"
                    name="address.city"
                    value={user?.address?.city || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="City"
                />
                <input
                    type="text"
                    name="address.sub_city"
                    value={user?.address?.sub_city || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="Sub City"
                />
                <input
                    type="text"
                    name="address.woreda"
                    value={user?.address?.woreda || ""}
                    onChange={onChange}
                    className="border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                    placeholder="Woreda"
                />
            </div>
        ) : (
            <p>
                {`${user?.address?.city || ""}, ${user?.address?.sub_city || ""}, ${
                    user?.address?.woreda || ""
                }`}
            </p>
        )}
    </div>
);

// Loading Skeleton for Orders
const OrderSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-4 p-3 items-center">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const UserProfile: React.FC = () => {
    const dispach = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { updateUser } = useUser();
    const { ordersQuery } = useOrder();
    const {
        data: ordersData,
        isLoading: isOrdersLoading,
        error: ordersError,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = ordersQuery as unknown as UseInfiniteQueryResult<{
        pages: any[];
        orders: OrderDetails[];
        nextPage: number;
        hasNextPage: boolean;
    }>;

    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [field, subField] = name.split(".");

        setUser((prev) => {
            if (!prev) return null;
            if (subField) {
                return {
                    ...prev,
                    [field]: {
                        ...(prev[
                            field as keyof UserData
                        ] as unknown as UserData),
                        [subField]: value,
                    },
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleEditToggle = () => {
        if (isEditing && user) {
            if (!user.email.includes("@")) {
                toast.error("Invalid email address.");
                return;
            }
            if (user.phone_number.length < 10) {
                toast.error("Invalid phone number.");
                return;
            }
            try {
                updateUser(user, user.phone_number);
                localStorage.setItem("user", JSON.stringify(user));
                toast.success("Profile updated successfully!");
            } catch (error) {
                console.error("Error saving user data:", error);
                toast.error("Failed to save profile.");
            }
        }
        setIsEditing(!isEditing);
    };

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleLogout = () => {
        setLoading(true);
        dispach(logout());
        navigate("/seregela-gebeya-v2");
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 grid sm:grid-cols-3 gap-6 bg-white shadow-md p-6 mt-4">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* User Profile Section */}
                    <div className="mb-6 col-span-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {t("User Profile")}
                            </h2>
                            <button
                                onClick={handleEditToggle}
                                className="text-primary hover:text-[#f1c87d] transition-colors"
                            >
                                {isEditing ? (
                                    <FaSave className="text-xl" />
                                ) : (
                                    <FaEdit className="text-xl" />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center space-x-6 mb-6 w-full">
                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                                <FaUser className="text-4xl text-gray-500" />
                            </div>
                            <div className="flex space-x-2">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={user?.first_name || ""}
                                            onChange={handleInputChange}
                                            className="w-1/2 border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                                            placeholder={t("First Name")}
                                        />
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={user?.last_name || ""}
                                            onChange={handleInputChange}
                                            className="w-1/2 border rounded px-2 py-1 focus:border-primary focus:ring-primary"
                                            placeholder={t("Last Name")}
                                        />
                                    </>
                                ) : (
                                    <h3 className="text-xl font-semibold">
                                        {user?.first_name} {user?.last_name}
                                    </h3>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ProfileField
                                icon={<FaEnvelope className="text-gray-500" />}
                                label="Email"
                                value={user?.email || ""}
                                name="email"
                                isEditing={isEditing}
                                onChange={handleInputChange}
                                type="email"
                                placeholder={t("Email")}
                            />
                            <ProfileField
                                icon={<FaPhone className="text-gray-500" />}
                                label="Phone"
                                value={user?.phone_number || ""}
                                name="phone_number"
                                isEditing={isEditing}
                                onChange={handleInputChange}
                                type="tel"
                                placeholder={t("Phone Number")}
                            />
                            <AddressFields
                                user={user}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />
                            <div className="flex items-center space-x-4">
                                <FaWallet className="text-gray-500" />
                                <p>
                                    {t("Wallet Balance")}:{" "}
                                    {user?.wallet_balance?.toFixed(2)}{" "}
                                    {t("birr")}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="space-x-4 hover:bg-[#e7a334] duration-300 p-2 rounded-lg border border-[#e7a334] text-primary flex items-center justify-center text-center hover:text-white transition-colors"
                            >
                                <RiLogoutBoxRLine />
                                <span className="ml-2">{t("Logout")}</span>
                            </button>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="col-span-2">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">
                            {t("Order History")}
                        </h3>
                        <div className="bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-4 p-3 bg-gray-100 font-medium text-gray-700">
                                <div>{t("Order Number")}</div>
                                <div>{t("Date")}</div>
                                <div>{t("Total")}</div>
                                <div>{t("Actions")}</div>
                            </div>
                            {isOrdersLoading ? (
                                <>
                                    <OrderSkeleton />
                                    <OrderSkeleton />
                                    <OrderSkeleton />
                                </>
                            ) : ordersError ? (
                                <div className="text-red-500 p-4">
                                    <p>
                                        {t(
                                            "Failed to load orders. Please try again."
                                        )}
                                    </p>
                                    <button
                                        onClick={() => refetch()}
                                        className="px-4 py-2 bg-gray-300 rounded"
                                    >
                                        {t("Retry")}
                                    </button>
                                </div>
                            ) : (
                                ordersData?.pages
                                    .flatMap((page: any) => page.orders)
                                    .map((order: any) => (
                                        <div
                                            key={order.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <div className="grid grid-cols-4 p-3 items-center">
                                                <div>{order.id}</div>
                                                <div>
                                                    {order.created_at.slice(
                                                        0,
                                                        10
                                                    )}
                                                </div>
                                                <div>
                                                    <PriceFormatter
                                                        price={order.order_cost.toFixed(
                                                            2
                                                        )}
                                                    />
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleOrderExpand(
                                                            order.id
                                                        )
                                                    }
                                                    className="text-primary hover:text-[#f1c87d] flex items-center"
                                                >
                                                    {expandedOrderId ===
                                                    order.id ? (
                                                        <FaChevronDown />
                                                    ) : (
                                                        <FaChevronRight />
                                                    )}
                                                    <span className="ml-2">
                                                        {expandedOrderId ===
                                                        order.id
                                                            ? t("Collapse")
                                                            : t("Expand")}
                                                    </span>
                                                </button>
                                            </div>
                                            {expandedOrderId === order.id && (
                                                <div className="p-4 bg-white">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="p-2 text-left">
                                                                    {t(
                                                                        "Product Name"
                                                                    )}
                                                                </th>
                                                                <th className="p-2 text-left">
                                                                    {t(
                                                                        "Quantity"
                                                                    )}
                                                                </th>
                                                                <th className="p-2 text-left">
                                                                    {t("Price")}
                                                                </th>
                                                                <th className="p-2 text-left">
                                                                    {t(
                                                                        "Subtotal"
                                                                    )}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.products.map(
                                                                (
                                                                    product: any
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        className="border-b last:border-b-0"
                                                                    >
                                                                        <td className="p-2">
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {
                                                                                product
                                                                                    .pivot
                                                                                    .quantity
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {parseInt(
                                                                                product.price
                                                                            ).toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            {t(
                                                                                "birr"
                                                                            )}
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {(
                                                                                product
                                                                                    .pivot
                                                                                    .quantity *
                                                                                parseInt(
                                                                                    product.price
                                                                                )
                                                                            ).toFixed(
                                                                                2
                                                                            )}{" "}
                                                                            {t(
                                                                                "birr"
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))
                            )}
                            {/* Pagination Controls */}
                            <div className="flex justify-between items-center p-4">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={!hasNextPage}
                                    className="px-4 py-2 bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-primary hover:border-primary border rounded-lg text-white transition-colors duration-300"
                                >
                                    {t("Load More")}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
