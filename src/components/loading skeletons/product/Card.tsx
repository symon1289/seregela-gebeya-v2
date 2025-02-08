const ProductCardLoading = () => {
    return (
        <div className="w-full max-w-[280px] mb-4 cursor-pointer flex-shrink-0 animate-pulse">
            <div className="bg-white overflow-hidden shadow-sm rounded-[20px] border border-primary/30 h-[280px]">
                <div className="relative h-40 bg-gray-200">
                    <div className="absolute bottom-2 right-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    </div>
                </div>
                <div className="p-2">
                    <div className="flex items-baseline gap-2 mb-4 justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-4/5" />
                        <div className="h-4 bg-gray-200 rounded w-3/5" />
                    </div>
                </div>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </div>
        </div>
    );
};

export default ProductCardLoading;
