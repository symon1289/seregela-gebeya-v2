import { FC } from "react";

const PackageLoading: FC = () => {
    return (
        <div className="group relative overflow-hidden rounded-xl shadow-md h-[388px] animate-pulse">
            <div className="absolute inset-0 bg-gray-200 z-0" />
            <div className="absolute inset-0 bg-gray-200 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    <div className="h-4 bg-gray-300 rounded w-1/4" />
                </div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
                <div className="absolute top-2 right-2 bg-gray-300 rounded-full p-2">
                    <div className="w-5 h-5 bg-gray-400/70 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default PackageLoading;