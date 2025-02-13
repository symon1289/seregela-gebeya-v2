import React, { useEffect, useState } from "react";
import {
    FaTruckArrowRight,
    FaCircleCheck,
    FaCircleXmark,
    FaRegFileLines,
} from "react-icons/fa6";
import { OrderDetails } from "../../types/order";
import { useOrder } from "../../hooks/useOrder";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import OrderDetail from "./OrderDetail";
import { DeliveryDelayCal, formatDateTime } from "../../utils/TimeCal";
import PaymentMethodDisplay from "./PaymentMethodDisplay";
import DropDown from "../DropDown";

import { getMyOrdersMetaTags } from "../../config/meta";
import Meta from "../Meta";
import { RotateCcw } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderSkeleton from "../loading skeletons/order/OrderSkeleton";

const Myorders: React.FC = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState("");
    const [orderId, setOrderId] = useState("");
    const [productName, setProductName] = useState("");
    const [packageName, setPackageName] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    // **Use Order Hook with Filters**
    const { ordersQuery } = useOrder({
        status: filter !== "" ? filter : undefined,
        id: orderId || undefined,
        product_name: productName || undefined,
        package_name: packageName || undefined,
    });

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

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const orderStatuses = [
        "unpaid",
        "pending-pickup",
        "pending-delivery",
        "payment-rejected",
        "successful",
        "canceled",
        "payment-refunded",
        "payment-reversed",
        "payment-captured",
    ];
    const hasActiveFilters =
        orderId.length > 0 || productName.length > 0 || packageName.length > 0;
    const handleClearFilters = () => {
        setOrderId("");
        setProductName("");
        setPackageName("");
        setFilter("");
        refetch();
    };

    useEffect(() => {
        refetch();
    }, [filter, refetch]);

    const handleFilterChange = (value: string) => {
        setFilter(value);
    };

    return (
        <>
            {" "}
            <Meta config={getMyOrdersMetaTags()} />
            <div className="flex space-x-4 justify-between mb-4 w-full">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder={t("search_by_id")}
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="border p-2 rounded shadow-sm outline-none focus:z-10 focus:border-primary focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder={t("search_by_product_name")}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="border p-2 rounded shadow-sm outline-none focus:z-10 focus:border-primary focus:ring-primary"
                    />
                    <input
                        type="text"
                        placeholder={t("search_by_package_name")}
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        className="border p-2 rounded shadow-sm outline-none focus:z-10 focus:border-primary focus:ring-primary"
                    />
                </div>
                <div className="flex space-x-2 ">
                    <DropDown
                        defaultLabel={t("all_orders")}
                        options={orderStatuses}
                        onSelect={handleFilterChange}
                        style="w-44"
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-300"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            {t("clear_filters")}
                        </button>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                {isOrdersLoading ? (
                    Array.from({ length: 9 }).map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))
                ) : ordersError ? (
                    <div className="text-red-500 p-4">
                        <p>{t("Failed to load orders. Please try again.")}</p>
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
                        .map((order) => (
                            <div
                                key={order.id}
                                className="bg-white p-4 rounded shadow"
                            >
                                <div className="flex justify-between border-b border-b-gray-300 pb-4 ">
                                    <div className="flex  space-x-2">
                                        <div className="flex items-center space-x-2 py-2">
                                            <h2 className="text-lg font-semibold">
                                                {t("order_id")}: {order.id}
                                            </h2>
                                            <OrderStatusBadge
                                                status={order.status}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-x-2 justify-between flex">
                                        <button
                                            onClick={() =>
                                                toggleOrderExpand(order.id)
                                            }
                                            className="bg-primary/30 text-quaternary hover:bg-primary hover:text-white  border border-primary/30 px-3 rounded-xl  justify-between flex items-center space-x-2"
                                        >
                                            <FaRegFileLines size={15} />
                                            {t("order_details")}
                                        </button>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <OrderDetail id={order.id} />
                                )}
                                <div className="flex justify-between items-center ">
                                    <p className="text-sm text-gray-700">
                                        {t("order_date")}:{" "}
                                        {order?.created_at &&
                                            formatDateTime(order?.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {t("shipping_methods")}:{" "}
                                        {order?.delivery_type?.name}
                                    </p>
                                    <PaymentMethodDisplay
                                        paymentMethod={order?.payment_method}
                                    />
                                </div>
                                <div className="mt-2">
                                    {order.status === "pending-delivery" && (
                                        <span className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-lg animate-pulse">
                                            <FaTruckArrowRight
                                                className="text-purple-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-purple-600">
                                                {DeliveryDelayCal(
                                                    order?.delivered_at,
                                                    t
                                                )}
                                            </p>
                                        </span>
                                    )}
                                    {order.status === "successful" && (
                                        <span className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg animate-pulse">
                                            <FaCircleCheck
                                                className="text-green-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-green-600">
                                                {t("delivery_date")}:
                                                {formatDateTime(
                                                    order?.delivered_at
                                                )}
                                            </p>
                                        </span>
                                    )}
                                    {order.status === "canceled" && (
                                        <span className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg animate-pulse ">
                                            <FaCircleXmark
                                                className="text-red-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-red-600">
                                                {t("cancel_on")}
                                                {order?.deleted_at &&
                                                    formatDateTime(
                                                        order?.deleted_at
                                                    )}
                                            </p>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                )}
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
        </>
    );
};

export default Myorders;
