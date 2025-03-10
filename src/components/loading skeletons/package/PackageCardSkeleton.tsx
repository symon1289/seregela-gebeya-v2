import React from "react";

const PackageCardSkeleton: React.FC = () => {
    return (
        <div className="w-[400px] bg-white shadow-md rounded-xl mx-auto border mt-2 border-gray-300 transition-shadow duration-500 hover:shadow-xl">
            <div className="h-[400px] w-[400px] bg-gray-200 animate-pulse rounded-t-xl"></div>
            <div className="px-4 py-3 w-[400px]">
                <div className="h-4 w-24 bg-gray-300 animate-pulse rounded mb-2"></div>
                <div className="h-6 w-full bg-gray-300 animate-pulse rounded mb-3"></div>
                <div className="flex items-center justify-between">
                    <div className="h-5 w-16 bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-5 w-20 bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-5 w-14 bg-gray-300 animate-pulse rounded"></div>
                </div>
                <div className="mt-3">
                    <div className="h-10 w-full bg-gray-300 animate-pulse rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default PackageCardSkeleton;
