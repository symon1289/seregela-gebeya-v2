import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
        null
    );
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const toggleDropdown = () => {
        setOpen(!open);
    };
    return (
        <div
            className="relative  text-left focus:border-[#e7a334] z-[50] overflow-visible "
            ref={dropdownRef}
        >
            <button
                aria-label="dropdown"
                onClick={toggleDropdown}
                className={`w-full relative inline-flex justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#e7a334] `}
            >
                <span className="hidden sm:inline pr-2">{t("sortby")}</span>
                <span className="flex items-center gap-2 justify-between">
                    {sortBy === "price"
                        ? t("price_low_to_high")
                        : sortBy === "-price"
                        ? t("price_high_to_low")
                        : t("latest")}
                    <ChevronDown
                        className="h-4 w-4 transition-transform duration-200"
                        style={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-full min-w-[150px]  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2 p-2">
                        {options.map((option, index) => (
                            <button
                                aria-label={option.label ?? undefined}
                                key={index}
                                onClick={() => {
                                    onSortChange(
                                        option.value as SortOption["value"]
                                    );
                                    setActiveCategoryId(option.label);
                                    toggleDropdown();
                                }}
                                className={`block w-full px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100 text-left ${
                                    option.label === activeCategoryId
                                        ? "bg-gray-50 font-medium text-primary"
                                        : ""
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortFilter;
