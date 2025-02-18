import React from "react";

const ForProductSection: React.FC = () => {
    return (
        <div className="w-full px-4 mb-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Product List Skeleton */}
            <ul>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <li
                        key={index}
                        className="justify-between items-center flex space-x-4 py-2 border-b"
                    >
                        <div className="flex items-center gap-4">
                            {/* Image Skeleton */}
                            <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>

                            {/* Product Info Skeleton */}
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* Add to Cart Button Skeleton */}
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ForProductSection;
