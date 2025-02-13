import React from "react";
import {
    FaHourglassHalf,
    FaTruckFast,
    FaArrowsRotate,
    FaCircleXmark,
    FaCheck,
    FaArrowRotateLeft,
    FaXmark,
    FaBan,
    FaBoxArchive,
} from "react-icons/fa6";

interface OrderStatusBadgeProps {
    status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const statusConfig = {
        unpaid: { icon: FaHourglassHalf, color: "yellow" },
        "pending-pickup": { icon: FaHourglassHalf, color: "blue" },
        successful: { icon: FaCheck, color: "green" },
        "pending-delivery": { icon: FaTruckFast, color: "purple" },
        "payment-rejected": { icon: FaBan, color: "red" },
        canceled: { icon: FaXmark, color: "red" },
        "payment-refunded": { icon: FaArrowsRotate, color: "yellow" },
        "payment-reversed": { icon: FaArrowRotateLeft, color: "yellow" },
        "payment-captured": { icon: FaBoxArchive, color: "yellow" },
    };

    //@ts-expect-error type any
    const { icon: Icon, color } = statusConfig[status] || {
        icon: FaCircleXmark,
        color: "gray",
    };

    // Map color to Tailwind classes
    const colorClasses = {
        yellow: { bg: "bg-yellow-200", text: "text-yellow-800" },
        blue: { bg: "bg-blue-200", text: "text-blue-800" },
        green: { bg: "bg-green-200", text: "text-green-800" },
        purple: { bg: "bg-purple-200", text: "text-purple-800" },
        red: { bg: "bg-red-200", text: "text-red-800" },
        gray: { bg: "bg-gray-200", text: "text-gray-800" },
    };
    //@ts-expect-error type any
    const { bg, text } = colorClasses[color] || colorClasses.gray;

    return (
        <span
            className={`px-3 py-1 text-xs rounded ${bg} ${text} flex items-center space-x-2`}
        >
            <Icon className={text} size={10} />
            <p>{status}</p>
        </span>
    );
};

export default OrderStatusBadge;
