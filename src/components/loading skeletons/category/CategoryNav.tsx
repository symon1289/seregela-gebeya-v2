import { FC } from 'react';

const CategoryNavLoading: FC = () => {
    return (
        <div className="block sm:block md:hidden w-full animate-pulse">
            <ul className="flex flex-col divide-y divide-gray-200">
                <li className="py-2 w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                </li>

                {Array.from({ length: 5 }).map((_, index) => (
                    <li key={index} className="py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                <div className="h-4 bg-gray-200 rounded w-32" />
                            </div>
                        </div>

                        <div className="pl-11 pr-4 py-1 space-y-1">
                            {Array.from({ length: 3 }).map((_, subIndex) => (
                                <div key={subIndex} className="py-1.5">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryNavLoading;
