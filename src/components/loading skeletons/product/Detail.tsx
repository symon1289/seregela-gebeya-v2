import { FC } from "react";
const ProductDetailLoad:FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg py-4 shadow-sm space-y-4 animate-pulse">
                <div className="relative aspect-square">
                    <div className="w-full h-full border rounded-lg bg-gray-200/80" />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-20 h-20 rounded-lg border-2 bg-gray-200/80"
                        />
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-lg py-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-3/4 h-8 bg-gray-200/80 rounded" />
                    <div className="w-8 h-8 bg-gray-200/80 rounded-full" />
                </div>
                <div className="w-1/2 h-6 bg-gray-200/80 rounded mb-4" />
                <div className="flex items-baseline gap-4 mb-6">
                    <div className="w-16 h-6 bg-gray-200/80 rounded" />
                    <div className="w-16 h-6 bg-gray-200/80 rounded line-through" />
                    <div className="w-12 h-6 bg-gray-200/80 rounded" />
                </div>
                <div className="mb-6">
                    <div className="w-1/3 h-6 bg-gray-200/80 rounded mb-2" />
                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-full h-4 bg-gray-200/80 rounded"
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-6 space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-24 h-4 bg-gray-200/80 rounded" />
                            <div className="w-32 h-4 bg-gray-200/80 rounded" />
                        </div>
                    ))}
                </div>
                <div className="mb-6 flex items-center gap-4">
                    <div className="w-24 h-4 bg-gray-200/80 rounded" />
                    <div className="w-20 h-8 bg-gray-200/80 rounded" />
                </div>
                <div className="w-full h-12 bg-gray-200/80 rounded-lg" />
            </div>
        </div>
    );
};

export default ProductDetailLoad;
