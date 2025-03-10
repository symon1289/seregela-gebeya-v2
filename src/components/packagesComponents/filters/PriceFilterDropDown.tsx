import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface PriceFilterProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
}

const PriceFilterDropDown: React.FC<PriceFilterProps> = ({
    minPrice,
    maxPrice,
    onPriceChange,
}) => {
    const { t } = useTranslation();
    const [selectedRange, setSelectedRange] = useState<string>("");
    const [customMin, setCustomMin] = useState(minPrice);
    const [customMax, setCustomMax] = useState(maxPrice);

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
    const formatNumber = (num: number) => num.toLocaleString();

    const priceRanges = [
        {
            label: `${formatNumber(0)} - ${formatNumber(100)}`,
            min: 0,
            max: 100,
        },
        {
            label: `${formatNumber(101)} - ${formatNumber(500)}`,
            min: 101,
            max: 500,
        },
        {
            label: `${formatNumber(501)} - ${formatNumber(1_000)}`,
            min: 501,
            max: 1000,
        },
        {
            label: `${formatNumber(1_001)} - ${formatNumber(10_000)}`,
            min: 1001,
            max: 10000,
        },
        {
            label: `${formatNumber(10_001)} - ${formatNumber(25_000)}`,
            min: 10001,
            max: 25000,
        },
        {
            label: `${formatNumber(25_001)} - ${formatNumber(50_000)}`,
            min: 25001,
            max: 50000,
        },
        {
            label: `${formatNumber(50_001)} - ${formatNumber(100_000)}`,
            min: 50001,
            max: 100000,
        },
        {
            label: `${formatNumber(100_001)} - ${formatNumber(1_000_000)}`,
            min: 100001,
            max: 1000000,
        },
    ];

    const handleRangeChange = (label: string) => {
        const selectedRange = priceRanges.find(
            (range) => range.label === label
        );
        if (selectedRange) {
            setSelectedRange(label);
            setCustomMin(selectedRange.min);
            setCustomMax(selectedRange.max);
            onPriceChange(selectedRange.min, selectedRange.max);
        }
    };

    const handleCustomMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setCustomMin(value);
        setSelectedRange(""); // Clear selected range
        if (value && customMax) {
            onPriceChange(value, customMax);
        }
    };

    const handleCustomMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setCustomMax(value);
        setSelectedRange(""); // Clear selected range
        if (value && customMin) {
            onPriceChange(customMin, value);
        }
    };

    const handleCustomBlur = () => {
        if (customMin && customMax) {
            onPriceChange(customMin, customMax);
        }
    };

    return (
        <div
            className="relative text-left focus:border-[#e7a334] z-[50] overflow-visible "
            ref={dropdownRef}
        >
            <button
                aria-label="dropdown"
                onClick={toggleDropdown}
                className={`w-full relative inline-flex justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#e7a334] `}
            >
                <span className="inline pr-2">{t("price_range")}</span>
                <span className="flex items-center gap-2 justify-between">
                    {activeCategoryId !== null &&
                        activeCategoryId + " " + t("birr")}
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
                        {priceRanges.map((option, index) => (
                            <button
                                aria-label={option.label ?? undefined}
                                key={index}
                                onClick={() => {
                                    handleRangeChange(option.label);
                                    setActiveCategoryId(option.label);
                                    toggleDropdown();
                                }}
                                className={`block w-full px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100 text-left ${
                                    option.label === selectedRange
                                        ? "bg-gray-50 font-medium text-primary"
                                        : ""
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                        <div className="flex flex-col space-y-2 mt-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customMin}
                                    onChange={handleCustomMinChange}
                                    onBlur={handleCustomBlur}
                                    className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Min Price"
                                    aria-label="Minimum price"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    {t("birr")}
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customMax}
                                    onChange={handleCustomMaxChange}
                                    onBlur={handleCustomBlur}
                                    className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Max Price"
                                    aria-label="Maximum price"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    {t("birr")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceFilterDropDown;
