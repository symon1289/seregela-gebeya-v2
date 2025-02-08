import { FC } from 'react';

const CategoryCardLoading: FC = () => (
    <div className="flex flex-col items-center animate-pulse">
        <div className="bg-gray-200 rounded-lg mb-2 aspect-square w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
);

export default CategoryCardLoading;
