import React, { useEffect, useRef, useState } from "react";
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
    const [localMin, setLocalMin] = useState(minPrice.toString());
    const [localMax, setLocalMax] = useState(maxPrice.toString());
    const minInputRef = useRef<HTMLInputElement>(null);
    const maxInputRef = useRef<HTMLInputElement>(null);
    const minRangeRef = useRef<HTMLInputElement>(null);
    const maxRangeRef = useRef<HTMLInputElement>(null);

    const MIN_GAP = 1000; // Minimum gap between handles in Birr
    const ABSOLUTE_MIN = 0;
    const ABSOLUTE_MAX = 100000;

    useEffect(() => {
        setLocalMin(minPrice.toString());
        setLocalMax(maxPrice.toString());

        if (minRangeRef.current && maxRangeRef.current) {
            minRangeRef.current.value = minPrice.toString();
            maxRangeRef.current.value = maxPrice.toString();
            updateSliderProgress();
        }
    }, [minPrice, maxPrice]);

    const updateSliderProgress = () => {
        if (minRangeRef.current && maxRangeRef.current) {
            const minVal = parseInt(minRangeRef.current.value);
            const maxVal = parseInt(maxRangeRef.current.value);
            const percent1 =
                ((minVal - ABSOLUTE_MIN) / (ABSOLUTE_MAX - ABSOLUTE_MIN)) * 100;
            const percent2 =
                ((maxVal - ABSOLUTE_MIN) / (ABSOLUTE_MAX - ABSOLUTE_MIN)) * 100;

            minRangeRef.current.style.background = `linear-gradient(to right, #E5E7EB ${percent1}%, #3B82F6 ${percent1}%, #3B82F6 ${percent2}%, #E5E7EB ${percent2}%)`;
        }
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalMin(value);

        const numValue = value === "" ? 0 : Math.max(0, parseInt(value));
        if (!isNaN(numValue) && numValue <= parseInt(localMax) - MIN_GAP) {
            onPriceChange(numValue, parseInt(localMax));
            if (minRangeRef.current) {
                minRangeRef.current.value = numValue.toString();
                updateSliderProgress();
            }
        }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalMax(value);

        const numValue =
            value === ""
                ? ABSOLUTE_MAX
                : Math.min(ABSOLUTE_MAX, parseInt(value));
        if (!isNaN(numValue) && numValue >= parseInt(localMin) + MIN_GAP) {
            onPriceChange(parseInt(localMin), numValue);
            if (maxRangeRef.current) {
                maxRangeRef.current.value = numValue.toString();
                updateSliderProgress();
            }
        }
    };

    const handleMinRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const maxValue = parseInt(localMax);

        if (value + MIN_GAP <= maxValue) {
            setLocalMin(value.toString());
            onPriceChange(value, maxValue);
            updateSliderProgress();
        }
    };

    const handleMaxRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const minValue = parseInt(localMin);

        if (value >= minValue + MIN_GAP) {
            setLocalMax(value.toString());
            onPriceChange(minValue, value);
            updateSliderProgress();
        }
    };

    const handleMinBlur = () => {
        const numValue = localMin === "" ? 0 : Math.max(0, parseInt(localMin));
        if (isNaN(numValue)) {
            setLocalMin(minPrice.toString());
        } else if (numValue > parseInt(localMax) - MIN_GAP) {
            const newValue = parseInt(localMax) - MIN_GAP;
            setLocalMin(newValue.toString());
            onPriceChange(newValue, parseInt(localMax));
        } else {
            setLocalMin(numValue.toString());
            onPriceChange(numValue, parseInt(localMax));
        }
        updateSliderProgress();
    };

    const handleMaxBlur = () => {
        const numValue =
            localMax === ""
                ? ABSOLUTE_MAX
                : Math.min(ABSOLUTE_MAX, parseInt(localMax));
        if (isNaN(numValue)) {
            setLocalMax(maxPrice.toString());
        } else if (numValue < parseInt(localMin) + MIN_GAP) {
            const newValue = parseInt(localMin) + MIN_GAP;
            setLocalMax(newValue.toString());
            onPriceChange(parseInt(localMin), newValue);
        } else {
            setLocalMax(numValue.toString());
            onPriceChange(parseInt(localMin), numValue);
        }
        updateSliderProgress();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <div className="space-y-6">
            <style>
                {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: #e9a83a;
            border-radius: 2px;
            position: absolute;
            pointer-events: none;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: white;
            border: 2px solid #e9a83a;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            margin-top: -6px;
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background-color: white;
            border: 2px solid #e9a83a;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
          }
        `}
            </style>

            <div className="relative h-1 w-full mt-8 mb-12">
                <input
                    ref={minRangeRef}
                    type="range"
                    min={ABSOLUTE_MIN}
                    max={ABSOLUTE_MAX}
                    value={localMin}
                    onChange={handleMinRangeChange}
                    className="absolute w-full"
                />
                <input
                    ref={maxRangeRef}
                    type="range"
                    min={ABSOLUTE_MIN}
                    max={ABSOLUTE_MAX}
                    value={localMax}
                    onChange={handleMaxRangeChange}
                    className="absolute w-full"
                />
            </div>

            <div className="flex flex-col space-y-2">
                <div className="relative">
                    <input
                        ref={minInputRef}
                        type="text"
                        value={localMin}
                        onChange={handleMinChange}
                        onBlur={handleMinBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min Price"
                        aria-label="Minimum price"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {t("birr")}
                    </span>
                </div>

                <div className="relative">
                    <input
                        ref={maxInputRef}
                        type="text"
                        value={localMax}
                        onChange={handleMaxChange}
                        onBlur={handleMaxBlur}
                        onKeyDown={handleKeyDown}
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
