import React from "react";

const DetailCard: React.FC = () => {
    return (
        <>
            <div className="z-40 mx-auto px-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Product Image Gallery Skeleton */}
                    <div className="bg-white rounded-lg py-4 shadow-sm space-y-4">
                        <div className="relative aspect-square">
                            <div className="w-full h-full border rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
                        </div>

                        {/* Thumbnail Gallery Skeleton */}
                        <div className="flex gap-2 overflow-x-auto">
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-transparent bg-gray-200 animate-pulse"
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="bg-white rounded-lg py-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        {/* Products List Skeleton */}
                        <div className="mb-2">
                            <div className="mt-2 space-y-3 rounded-lg overflow-y-auto border max-h-72 bg-white px-2 py-4 sm:px-6">
                                {[1, 2, 3].map((index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col rounded-lg bg-white sm:flex-row"
                                    >
                                        <div className="m-2 h-24 w-28 rounded-md border bg-gray-200 animate-pulse"></div>
                                        <div className="flex w-full flex-col px-4 py-4 space-y-2">
                                            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector Skeleton */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="relative">
                                <div className="flex items-center">
                                    <div className="border rounded-l-lg px-3 py-2 w-20 bg-gray-200 animate-pulse"></div>
                                    <div className="border border-l-0 rounded-r-lg px-3 py-3 bg-gray-200 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Button Skeleton */}
                        <div className="w-full bg-gray-200 py-3 px-6 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailCard;
