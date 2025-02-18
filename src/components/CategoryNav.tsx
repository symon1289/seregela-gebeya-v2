import React from "react";
import { Grid } from "lucide-react";
import { Link } from "react-router-dom";

interface Subcategory {
    id: number;
    name: string;
    name_am: string | null;
    products_count: number;
}

interface Category {
    id: number;
    name: string;
    name_am: string;
    products_count: number;
    subcategories: Subcategory[];
    image_path: string;
}

interface CategoryNavProps {
    categories: Category[];
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories }) => {
    return (
        <div className="block sm:block md:hidden w-full">
            <ul className="flex flex-col divide-y divide-gray-200">
                <li className="py-2 w-full">
                    <Link
                        to="/products"
                        className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#e9a83a] text-sm font-medium"
                    >
                        <Grid className="w-8 h-8" />
                        <span>All Products</span>
                    </Link>
                </li>

                {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                        <li key={category.id} className="py-2">
                            <div className="flex items-center justify-between">
                                <Link
                                    to={`/category/${category.id}`}
                                    className="flex items-center gap-3 text-[#1a1a1a] hover:text-[#e9a83a] text-sm font-medium transition-colors duration-200"
                                >
                                    <img
                                        src={category.image_path}
                                        alt={category.name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <span>{category.name}</span>
                                </Link>
                            </div>

                            {/* Subcategories */}
                            {category.subcategories.length > 0 && (
                                <div className="pl-11 pr-4 py-1 space-y-1">
                                    {category.subcategories
                                        .filter((sub) => sub.products_count > 0)
                                        .map((subcategory) => (
                                            <Link
                                                key={subcategory.id}
                                                to={`/subcategory/${subcategory.id}`}
                                                className="block py-1.5 text-sm text-gray-600 hover:text-[#e9a83a]"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>
                                                        {subcategory.name}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default CategoryNav;
