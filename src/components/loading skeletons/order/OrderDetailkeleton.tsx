import React from "react";

const OrderDetailkeleton: React.FC = () => {
    return (
        <main className="py-1 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                <div className="w-full flex-col justify-start items-center gap-4 inline-flex">
                    {/* Order Details Skeleton */}
                    <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="w-full py-6 border-t border-b border-gray-100 md:justify-between justify-center md:items-start items-center md:gap-8 gap-10 flex flex-wrap">
                            {/* Order Date Skeleton */}
                            <div className="flex-col justify-start items-start gap-3 inline-flex">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            {/* Delivered Date Skeleton */}
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            {/* Number of Items Skeleton */}
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            {/* Status Skeleton */}
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Products List Skeleton */}
                    <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="w-full justify-center items-start">
                            {/* Table Header Skeleton */}
                            <div className="w-full hidden md:grid grid-cols-2 p-4 bg-gray-50">
                                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="flex items-center justify-between">
                                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            {/* Product Rows Skeleton */}
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-2 min-[550px]:gap-6 py-3 border-b border-gray-200 max-sm:max-w-xl max-xl:mx-auto"
                                >
                                    <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-4 w-full max-sm:justify-center max-sm:max-w-xl max-xl:mx-auto">
                                        <div className="w-[120px] h-[120px] bg-gray-200 rounded-xl animate-pulse"></div>
                                        <div className="pro-data w-full max-w-sm flex-col justify-start items-start gap-2 inline-flex">
                                            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between flex-col min-[550px]:flex-row w-full max-sm:max-w-xl max-xl:mx-auto gap-2">
                                        <div className="max-w-[160px] flex items-center w-full mx-0 justify-center gap-5">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section Skeleton */}
                    <div className="w-full justify-start items-start gap-8 grid sm:grid-cols-2 grid-cols-1">
                        <div className="w-full p-6 rounded-xl border border-gray-200 flex-col justify-start items-start gap-4 inline-flex">
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="w-full p-6 rounded-xl border border-gray-200 flex-col justify-start items-start gap-4 inline-flex">
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="w-full justify-between items-start gap-2.5 inline-flex">
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderDetailkeleton;
