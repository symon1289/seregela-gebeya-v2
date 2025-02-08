const CategorySideBar = () => {
    return (
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-gray-300" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
        </div>
    );
};

export const CategoryItems = () => {
    return (
        <li className="group animate-pulse">
            <div className="flex items-center justify-between py-2 group">
                <div className="flex items-center gap-3 ml-4 w-full">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200" />
                    <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                </div>
                <div className="mr-4">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm" />
                </div>
            </div>
        </li>
    );
};

export default CategorySideBar;
