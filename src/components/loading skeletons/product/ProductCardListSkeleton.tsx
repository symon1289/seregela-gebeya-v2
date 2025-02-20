import React from "react";

const ProductCardListSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white border rounded-xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-300">
            {/* Product Image Skeleton */}
            <div className="w-60 h-60 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Product Details Skeleton */}
            <div className="flex-1 space-y-4">
                {/* Product Name Skeleton */}
                <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stock Information Skeleton */}
                <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>

                {/* Max Quantity Skeleton */}
                <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>

                {/* Price and Discount Skeleton */}
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Add to Cart Button Skeleton */}
            <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
    );
};

export default ProductCardListSkeleton;
