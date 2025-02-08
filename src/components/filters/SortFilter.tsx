import React from "react";
import { ChevronDown } from "lucide-react";

export interface SortOption {
    value: "price" | "created_at" | "-price";
    label: string;
}

interface SortFilterProps {
    sortBy: SortOption["value"];
    onSortChange: (value: SortOption["value"]) => void;
    options: SortOption[];
}

const defaultOptions: SortOption[] = [
    { value: "created_at", label: "Latest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
];

const SortFilter: React.FC<SortFilterProps> = ({
    sortBy,
    onSortChange,
    options = defaultOptions,
}) => {
    return (
        <div className="relative">
            <select
                value={sortBy}
                onChange={(e) =>
                    onSortChange(e.target.value as SortOption["value"])
                }
                className="w-full pl-3 pr-8 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Sort products"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
        </div>
    );
};

export default SortFilter;
