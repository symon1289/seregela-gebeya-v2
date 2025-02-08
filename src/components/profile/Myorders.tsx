import React, { useState } from "react";
import {
    FaTruckArrowRight,
    FaHourglassHalf,
    FaTruckFast,
    FaDownload,
    FaArrowsRotate,
    FaCircleCheck,
    FaCircleXmark,
    FaRegFileLines,
    FaCheck,
    FaArrowRotateLeft,
    FaXmark,
    FaBan,
    FaBoxArchive,
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
const formatDate = (date: Date) => {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const getDateRangeOptions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const lastYear = new Date(today.getFullYear() - 1, 0, 1);

    const allTime = new Date(2023, 1, 1);

    return [
        { label: "Today", range: [today, today] },
        { label: "Yesterday", range: [yesterday, today] },
        { label: "Last 7 days", range: [last7Days, today] },
        { label: "Last Month", range: [lastMonth, today] },
        { label: "Last Year", range: [lastYear, today] },
        { label: "All Time", range: [allTime, today] },
    ];
};
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
const Myorders: React.FC = () => {
    const { t } = useTranslation();
    const { ordersQuery } = useOrder();
    const { useOrdersByStatus } = useOrder();
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

    const [filter, setFilter] = useState("All orders");

    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const orderStatuses = [
        "All orders",
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

    const DateRangeOptions = getDateRangeOptions().map(
        ({ label, range }) =>
            `${label} ${formatDate(range[0])} - ${formatDate(range[1])}`
    );
    const [dateRange, setDateRange] = useState(DateRangeOptions[0]);
    const {
        data: ordersByStatus,
        isLoading: isOrdersByStatusLoading,
        error: ordersByStatusError,
    } = useOrdersByStatus(filter);
    console.log(ordersByStatus?.pages);
    return (
        <>
            {" "}
            <Meta config={getMyOrdersMetaTags()} />
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search by Order ID"
                        className="border p-2 rounded"
                    />
                    <button className="bg-primary text-white px-4 py-2 rounded">
                        Search
                    </button>
                </div>
                <div className="flex space-x-2">
                    <DropDown
                        defaultLabel="All orders"
                        options={orderStatuses}
                        onSelect={(value) => setFilter(value)}
                        style="w-44"
                    />
                    <DropDown
                        options={DateRangeOptions}
                        defaultLabel={dateRange}
                        onSelect={(selected) => setDateRange(selected)}
                        style="w-full"
                    />
                </div>
            </div>
            <div className="space-y-4">
                {isOrdersLoading || isOrdersByStatusLoading ? (
                    <>
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                        <OrderSkeleton />
                    </>
                ) : ordersError || ordersByStatusError ? (
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
                                                Order ID: {order.id}
                                            </h2>
                                            {order.status === "unpaid" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-yellow-200 text-yellow-800 flex items-center space-x-2`}
                                                    >
                                                        <FaHourglassHalf
                                                            className="text-yellow-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "pending-pickup" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-blue-200 text-blue-800 flex items-center space-x-2`}
                                                    >
                                                        <FaHourglassHalf
                                                            className="text-blue-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status === "successful" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-green-200 text-green-800 flex items-center space-x-2`}
                                                    >
                                                        <FaCheck
                                                            className="text-green-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "pending-delivery" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-purple-200 text-purple-800 flex items-center space-x-2`}
                                                    >
                                                        <FaTruckFast
                                                            className="text-purple-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "payment-rejected" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-red-200 text-red-800 flex items-center space-x-2`}
                                                    >
                                                        <FaBan
                                                            className="text-red-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status === "canceled" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-red-200 text-red-800 flex items-center space-x-2`}
                                                    >
                                                        <FaXmark
                                                            className="text-red-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "payment-refunded" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-yellow-200 text-yellow-800 flex items-center space-x-2`}
                                                    >
                                                        <FaArrowsRotate
                                                            className="text-yellow-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "payment-reversed" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-yellow-200 text-yellow-800 flex items-center space-x-2`}
                                                    >
                                                        <FaArrowRotateLeft
                                                            className="text-yellow-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                            {order.status ===
                                                "payment-captured" && (
                                                <>
                                                    <span
                                                        className={`px-3 py-1 text-xs justify-between rounded bg-yellow-200 text-yellow-800 flex items-center space-x-2`}
                                                    >
                                                        <FaBoxArchive
                                                            className="text-yellow-800"
                                                            size={10}
                                                        />
                                                        <p> {order.status}</p>
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {order.status === "successful" && (
                                            <div className="flex justify-start items-center">
                                                <FaDownload
                                                    className="text-blue-600 mr-2"
                                                    size={15}
                                                />
                                                <button className="text-sm text-blue-600 hover:underline">
                                                    Download invoice
                                                </button>
                                            </div>
                                        )}
                                        {order.status ===
                                            "pending-delivery" && (
                                            <div className="flex justify-start items-center">
                                                <FaDownload
                                                    className="text-blue-600 mr-2"
                                                    size={15}
                                                />
                                                <button className="text-sm text-blue-600 hover:underline">
                                                    Download invoice
                                                </button>
                                            </div>
                                        )}
                                        {order.status === "pending-pickup" && (
                                            <div className="flex justify-start items-center">
                                                <FaDownload
                                                    className="text-blue-600 mr-2"
                                                    size={15}
                                                />
                                                <button className="text-sm text-blue-600 hover:underline">
                                                    Download invoice
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-x-2 justify-between flex">
                                        <button className="bg-primary text-white px-3 rounded-xl hover:bg-white hover:text-primary  border border-primary">
                                            Cancel order
                                        </button>
                                        <button
                                            onClick={() =>
                                                toggleOrderExpand(order.id)
                                            }
                                            className="bg-primary/30 text-quaternary hover:bg-primary hover:text-white  border border-primary/30 px-3 rounded-xl  justify-between flex items-center space-x-2"
                                        >
                                            <FaRegFileLines size={15} />
                                            Order details
                                        </button>
                                    </div>
                                </div>
                                {expandedOrderId === order.id && (
                                    <OrderDetail id={order.id} />
                                )}
                                <div className="flex justify-between items-center ">
                                    <p className="text-sm text-gray-700">
                                        Order date:{" "}
                                        {order?.created_at &&
                                            formatDateTime(order?.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Delivery Method:{" "}
                                        {order?.delivery_type?.name}
                                    </p>
                                    <PaymentMethodDisplay
                                        paymentMethod={order?.payment_method}
                                    />
                                </div>
                                <div className="mt-2">
                                    {order.status === "pending-delivery" && (
                                        <span className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-lg">
                                            <FaTruckArrowRight
                                                className="text-purple-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-purple-600">
                                                {DeliveryDelayCal(
                                                    order?.delivered_at
                                                )}
                                            </p>
                                        </span>
                                    )}
                                    {order.status === "successful" && (
                                        <span className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
                                            <FaCircleCheck
                                                className="text-green-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-green-600">
                                                Delivered on
                                                {formatDateTime(
                                                    order?.delivered_at
                                                )}
                                            </p>
                                        </span>
                                    )}
                                    {order.status === "canceled" && (
                                        <span className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg">
                                            <FaCircleXmark
                                                className="text-red-600"
                                                size={15}
                                            />
                                            <p className="text-sm text-red-600">
                                                Canceled on
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
