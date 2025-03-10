import React, { useState } from "react";
import ViewToggle from "./ViewToggle";
import { RotateCcw, Search } from "lucide-react";
import SortFilter, { SortOption } from "./SortFilter";
import PriceFilterDropDown from "./PriceFilterDropDown";
import TagsDropDown from "./TagsDropDown";
import { useTranslation } from "react-i18next";

type ViewMode = "grid" | "list";

interface FilterBarProps {
    className?: string;
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
    sortBy: SortOption["value"];
    onSortChange: (value: SortOption["value"]) => void;
    activeView: ViewMode;
    onChange: () => void;
    onSearchChange: (query: string) => void;
}
const defaultSortOptions: SortOption[] = [
    { value: "created_at", label: "Latest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
];
const FilterBar: React.FC<FilterBarProps> = ({
    className,
    minPrice,
    maxPrice,
    onPriceChange,
    sortBy,
    onSortChange,
    activeView,
    onChange,
    onSearchChange,
}) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchChange(query); // Send query to the parent
    };
    const handleClearFilters = () => {
        onPriceChange(0, 1000000);
        onSortChange("created_at");
        window.location.reload();
    };

    const hasActiveFilters =
        minPrice > 0 || maxPrice < 1000000 || sortBy !== "created_at";
    return (
        <div
            className={`flex w-full flex-col sm:flex-row items-start md:items-center justify-between gap-3 rounded-xl bg-filter-bg py-2 ${
                className || ""
            }`}
        >
            <div className="flex flex-1 flex-col md:flex-row w-full md:w-auto items-start lg:items-center gap-3">
                <div className="relative w-full md:w-auto">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border border-gray-300 border-filter-border bg-white py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder={t("search_packages")}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="flex flex-col md:flex-wrap lg:flex-row w-full  gap-2 md:gap-3 justify-between ">
                    <div className="flex items-center gap-3 justify-between sm:justify-normal">
                        <TagsDropDown />
                        <PriceFilterDropDown
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onPriceChange={onPriceChange}
                        />
                        <SortFilter
                            options={defaultSortOptions}
                            sortBy={sortBy}
                            onSortChange={onSortChange}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-300"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                {t("clear_filters")}
                            </button>
                        )}
                        <ViewToggle
                            activeView={activeView}
                            onChange={onChange}
                            className=" md:mt-0 items-center justify-self-end "
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
