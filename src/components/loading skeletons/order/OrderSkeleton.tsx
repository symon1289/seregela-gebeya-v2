import React from "react";

const OrderSkeleton: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded shadow animate-pulse">
            <div className="flex justify-between border-b border-b-gray-300 pb-4 ">
                <div className="flex space-x-2">
                    <div className="flex items-center space-x-2 py-2">
                        <div className="w-24 h-5 bg-gray-200 rounded" />
                        <div className="w-12 h-5 bg-gray-200 rounded" />
                    </div>
                </div>
                <div className="space-x-2 justify-between flex">
                    <button className="bg-gray/30 text-gray hover:bg-gray hover:text-white border border-gray/30 px-3 rounded-xl justify-between flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded" />
                        <div className="w-24 h-5 bg-gray-200 rounded" />
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="w-32 h-4 bg-gray-200 rounded" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
            </div>

            <div className="mt-2">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg w-32 h-4 " />
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg w-32 h-4 " />
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg w-32 h-4 " />
            </div>
        </div>
    );
};

export default OrderSkeleton;
