import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface PriceFilterProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
    minPrice,
    maxPrice,
    onPriceChange,
}) => {
    const { t } = useTranslation();
    const [selectedRange, setSelectedRange] = useState<string>("");
    const [customMin, setCustomMin] = useState(minPrice);
    const [customMax, setCustomMax] = useState(maxPrice);
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

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLabel = e.target.value;
        const selectedRange = priceRanges.find(
            (range) => range.label === selectedLabel
        );
        if (selectedRange) {
            setSelectedRange(selectedLabel);
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
        <div className="space-y-6">
            {/* Radio buttons for predefined ranges */}
            <div className="space-y-2">
                {priceRanges.map((range, index) => (
                    <label
                        key={index}
                        className={`flex items-center space-x-2 hover:bg-primary hover:text-white py-0.5 px-2 rounded-md cursor-pointer  ${
                            selectedRange === range.label
                                ? "bg-primary text-white"
                                : "text-gray-700"
                        }`}
                    >
                        <input
                            type="radio"
                            name="priceRange"
                            value={range.label}
                            checked={selectedRange === range.label}
                            onChange={handleRangeChange}
                            className="custom-radio"
                        />
                        <span>
                            {range.label} {t("birr")}
                        </span>
                    </label>
                ))}
            </div>

            {/* Custom price range inputs */}
            <div className="flex flex-col space-y-2">
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
                        className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Max Price"
                        aria-label="Maximum price"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {t("birr")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PriceFilter;
