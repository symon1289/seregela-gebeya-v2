import React from "react";

const PackageCardSkeletonForList: React.FC = () => {
    return (
        <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-3 md:max-w-full mx-auto border border-gray-300 bg-white animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full md:w-1/3 bg-gray-200 rounded-xl h-64"></div>

            {/* Content Skeleton */}
            <div className="w-full md:w-2/3 flex flex-col space-y-3 py-3 justify-between">
                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto md:mx-0"></div>

                {/* Product List */}
                <div className="space-y-3 border max-h-72 overflow-y-auto px-2 py-4 bg-white rounded-lg">
                    {Array(3)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 p-2 rounded-lg bg-gray-100"
                            >
                                <div className="h-24 w-28 bg-gray-300 rounded-md"></div>
                                <div className="flex flex-col space-y-2 w-full">
                                    <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                                    <div className="h-6 w-1/2 bg-gray-400 rounded"></div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Stock and Max Quantity */}
                <div className="flex justify-between items-center">
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                    <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
                </div>

                {/* Price and Button */}
                <div className="space-y-4 flex-col flex md:flex-row justify-between items-center">
                    <div className="h-8 w-24 bg-gray-300 rounded"></div>
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    <div className="h-10 w-36 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default PackageCardSkeletonForList;
